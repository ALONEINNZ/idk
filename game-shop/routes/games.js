const express = require('express');
const multer = require('multer');
const path = require('path');
const Game = require('../models/Game');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 12 } = req.query;
    
    let query = { active: true };
    
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const games = await Game.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Game.countDocuments(query);

    res.json({
      games,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single game
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate('reviews.user', 'username');
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create game (admin only)
router.post('/', auth, adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const gameData = JSON.parse(req.body.gameData);
    
    if (req.files) {
      gameData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const game = new Game(gameData);
    await game.save();
    
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update game (admin only)
router.put('/:id', auth, adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const gameData = JSON.parse(req.body.gameData);
    
    if (req.files && req.files.length > 0) {
      gameData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const game = await Game.findByIdAndUpdate(req.params.id, gameData, { new: true });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete game (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;