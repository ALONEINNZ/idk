const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Game = require('../models/Game');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { gameIds } = req.body;
    
    const games = await Game.find({ _id: { $in: gameIds } });
    const totalAmount = games.reduce((sum, game) => sum + game.price, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: req.userId,
        gameIds: gameIds.join(',')
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm purchase
router.post('/confirm-purchase', auth, async (req, res) => {
  try {
    const { paymentIntentId, gameIds } = req.body;
    
    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const games = await Game.find({ _id: { $in: gameIds } });
    const totalAmount = games.reduce((sum, game) => sum + game.price, 0);

    // Create order
    const order = new Order({
      user: req.userId,
      games: games.map(game => ({
        game: game._id,
        price: game.price
      })),
      totalAmount,
      paymentStatus: 'completed',
      paymentId: paymentIntentId
    });

    await order.save();

    // Add games to user's purchased games
    const user = await User.findById(req.userId);
    const newPurchases = games.map(game => ({
      game: game._id,
      purchaseDate: new Date()
    }));
    
    user.purchasedGames.push(...newPurchases);
    await user.save();

    res.json({
      message: 'Purchase completed successfully',
      order: order,
      downloadLinks: games.map(game => ({
        gameId: game._id,
        title: game.title,
        downloadUrl: game.downloadUrl
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('games.game')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;