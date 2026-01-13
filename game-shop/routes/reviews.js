const express = require('express');
const ModReview = require('../models/ModReview');
const UserProfile = require('../models/UserProfile');
const Mod = require('../models/Mod');
const auth = require('../middleware/auth');

const router = express.Router();

// Get reviews for a mod
router.get('/mod/:modId', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'newest' } = req.query;
        
        let sortOption = { createdAt: -1 }; // newest first
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'rating_high') sortOption = { rating: -1 };
        if (sort === 'rating_low') sortOption = { rating: 1 };
        if (sort === 'helpful') sortOption = { 'helpfulVotes.up': -1 };
        
        const startIndex = (page - 1) * limit;
        
        const reviews = await ModReview.find({ 
            modId: req.params.modId,
            status: 'active'
        })
        .populate('userId', 'username')
        .populate('replies.userId', 'username')
        .sort(sortOption)
        .skip(startIndex)
        .limit(parseInt(limit));
        
        const total = await ModReview.countDocuments({ 
            modId: req.params.modId,
            status: 'active'
        });
        
        // Calculate average rating
        const ratingStats = await ModReview.aggregate([
            { $match: { modId: req.params.modId, status: 'active' } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    ratingDistribution: {
                        $push: '$rating'
                    }
                }
            }
        ]);
        
        const stats = ratingStats[0] || { averageRating: 0, totalReviews: 0 };
        
        res.json({
            reviews,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                total
            },
            stats
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a review
router.post('/mod/:modId', auth, async (req, res) => {
    try {
        const {
            rating,
            title,
            content,
            pros,
            cons,
            gameVersion,
            modVersion,
            systemSpecs,
            performanceImpact
        } = req.body;
        
        // Check if user already reviewed this mod
        const existingReview = await ModReview.findOne({
            modId: req.params.modId,
            userId: req.userId
        });
        
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this mod' });
        }
        
        // Verify mod exists
        const mod = await Mod.findById(req.params.modId);
        if (!mod) {
            return res.status(404).json({ message: 'Mod not found' });
        }
        
        const review = new ModReview({
            modId: req.params.modId,
            userId: req.userId,
            rating,
            title,
            content,
            pros: pros || [],
            cons: cons || [],
            gameVersion,
            modVersion,
            systemSpecs,
            performanceImpact
        });
        
        await review.save();
        
        // Update user profile stats
        await UserProfile.findOneAndUpdate(
            { userId: req.userId },
            { 
                $inc: { 'stats.reviewsGiven': 1 },
                $push: {
                    recentActivity: {
                        $each: [{
                            type: 'review_posted',
                            description: `Posted review for ${mod.title}`,
                            relatedId: mod._id
                        }],
                        $position: 0,
                        $slice: 20
                    }
                }
            },
            { upsert: true }
        );
        
        // Update mod's average rating
        const reviews = await ModReview.find({ modId: req.params.modId, status: 'active' });
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Mod.findByIdAndUpdate(req.params.modId, { rating: averageRating });
        
        const populatedReview = await ModReview.findById(review._id)
            .populate('userId', 'username');
        
        res.status(201).json(populatedReview);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a review
router.put('/:reviewId', auth, async (req, res) => {
    try {
        const review = await ModReview.findById(req.params.reviewId);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        if (review.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }
        
        const {
            rating,
            title,
            content,
            pros,
            cons,
            gameVersion,
            modVersion,
            systemSpecs,
            performanceImpact
        } = req.body;
        
        review.rating = rating;
        review.title = title;
        review.content = content;
        review.pros = pros || [];
        review.cons = cons || [];
        review.gameVersion = gameVersion;
        review.modVersion = modVersion;
        review.systemSpecs = systemSpecs;
        review.performanceImpact = performanceImpact;
        
        await review.save();
        
        // Recalculate mod's average rating
        const reviews = await ModReview.find({ modId: review.modId, status: 'active' });
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Mod.findByIdAndUpdate(review.modId, { rating: averageRating });
        
        const populatedReview = await ModReview.findById(review._id)
            .populate('userId', 'username');
        
        res.json(populatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Vote on review helpfulness
router.post('/:reviewId/vote', auth, async (req, res) => {
    try {
        const { vote } = req.body; // 'up' or 'down'
        
        if (!['up', 'down'].includes(vote)) {
            return res.status(400).json({ message: 'Invalid vote type' });
        }
        
        const review = await ModReview.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        // Check if user already voted
        const existingVoteIndex = review.helpfulVotes.voters.findIndex(
            voter => voter.userId.toString() === req.userId
        );
        
        if (existingVoteIndex !== -1) {
            const existingVote = review.helpfulVotes.voters[existingVoteIndex];
            
            // Remove old vote count
            if (existingVote.vote === 'up') {
                review.helpfulVotes.up -= 1;
            } else {
                review.helpfulVotes.down -= 1;
            }
            
            // If same vote, remove it entirely
            if (existingVote.vote === vote) {
                review.helpfulVotes.voters.splice(existingVoteIndex, 1);
            } else {
                // Change vote
                existingVote.vote = vote;
                if (vote === 'up') {
                    review.helpfulVotes.up += 1;
                } else {
                    review.helpfulVotes.down += 1;
                }
            }
        } else {
            // New vote
            review.helpfulVotes.voters.push({
                userId: req.userId,
                vote
            });
            
            if (vote === 'up') {
                review.helpfulVotes.up += 1;
            } else {
                review.helpfulVotes.down += 1;
            }
        }
        
        await review.save();
        
        res.json({
            helpfulVotes: review.helpfulVotes,
            message: 'Vote recorded successfully'
        });
    } catch (error) {
        console.error('Error voting on review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reply to review
router.post('/:reviewId/reply', auth, async (req, res) => {
    try {
        const { content } = req.body;
        
        const review = await ModReview.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        // Check if user is the mod creator
        const mod = await Mod.findById(review.modId);
        const isCreatorReply = mod && mod.authorId.toString() === req.userId;
        
        const reply = {
            userId: req.userId,
            content,
            isCreatorReply
        };
        
        review.replies.push(reply);
        await review.save();
        
        const populatedReview = await ModReview.findById(review._id)
            .populate('userId', 'username')
            .populate('replies.userId', 'username');
        
        res.status(201).json(populatedReview);
    } catch (error) {
        console.error('Error replying to review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Flag review
router.post('/:reviewId/flag', auth, async (req, res) => {
    try {
        const { reason, description } = req.body;
        
        const validReasons = ['spam', 'inappropriate', 'fake', 'offensive', 'other'];
        if (!validReasons.includes(reason)) {
            return res.status(400).json({ message: 'Invalid flag reason' });
        }
        
        const review = await ModReview.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        // Check if user already flagged this review
        const existingFlag = review.flags.find(flag => 
            flag.userId.toString() === req.userId
        );
        
        if (existingFlag) {
            return res.status(400).json({ message: 'You have already flagged this review' });
        }
        
        review.flags.push({
            userId: req.userId,
            reason,
            description
        });
        
        await review.save();
        
        res.json({ message: 'Review flagged successfully' });
    } catch (error) {
        console.error('Error flagging review:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's reviews
router.get('/user/:userId', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const startIndex = (page - 1) * limit;
        
        const reviews = await ModReview.find({ 
            userId: req.params.userId,
            status: 'active'
        })
        .populate('modId', 'title images')
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(parseInt(limit));
        
        const total = await ModReview.countDocuments({ 
            userId: req.params.userId,
            status: 'active'
        });
        
        res.json({
            reviews,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;