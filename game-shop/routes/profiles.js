const express = require('express');
const UserProfile = require('../models/UserProfile');
const ModReview = require('../models/ModReview');
const Mod = require('../models/Mod');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.params.userId })
            .populate('userId', 'username email')
            .populate('followedCreators', 'username')
            .populate('followers', 'username')
            .populate('modCollections.mods');
        
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/:userId', auth, async (req, res) => {
    try {
        // Check if user is updating their own profile
        if (req.userId !== req.params.userId) {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }
        
        const {
            displayName,
            bio,
            location,
            website,
            socialLinks,
            preferences,
            favoriteGames
        } = req.body;
        
        const profile = await UserProfile.findOneAndUpdate(
            { userId: req.params.userId },
            {
                displayName,
                bio,
                location,
                website,
                socialLinks,
                preferences,
                favoriteGames
            },
            { new: true, upsert: true }
        );
        
        res.json(profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Follow/unfollow creator
router.post('/:userId/follow', auth, async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.userId;
        
        if (targetUserId === currentUserId) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }
        
        const currentUserProfile = await UserProfile.findOne({ userId: currentUserId });
        const targetUserProfile = await UserProfile.findOne({ userId: targetUserId });
        
        if (!targetUserProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if already following
        const isFollowing = currentUserProfile.followedCreators.includes(targetUserId);
        
        if (isFollowing) {
            // Unfollow
            currentUserProfile.followedCreators.pull(targetUserId);
            targetUserProfile.followers.pull(currentUserId);
        } else {
            // Follow
            currentUserProfile.followedCreators.push(targetUserId);
            targetUserProfile.followers.push(currentUserId);
        }
        
        await currentUserProfile.save();
        await targetUserProfile.save();
        
        res.json({ 
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            isFollowing: !isFollowing
        });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's mod collections
router.get('/:userId/collections', async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.params.userId })
            .populate('modCollections.mods')
            .select('modCollections');
        
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        // Filter public collections or user's own collections
        const collections = profile.modCollections.filter(collection => 
            collection.isPublic || req.userId === req.params.userId
        );
        
        res.json(collections);
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create mod collection
router.post('/:userId/collections', auth, async (req, res) => {
    try {
        if (req.userId !== req.params.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const { name, description, mods, isPublic } = req.body;
        
        const profile = await UserProfile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        const newCollection = {
            name,
            description,
            mods: mods || [],
            isPublic: isPublic !== false
        };
        
        profile.modCollections.push(newCollection);
        await profile.save();
        
        res.status(201).json(newCollection);
    } catch (error) {
        console.error('Error creating collection:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user achievements
router.get('/:userId/achievements', async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.params.userId })
            .select('achievements badges reputation');
        
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        res.json({
            achievements: profile.achievements,
            badges: profile.badges,
            reputation: profile.reputation
        });
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Award achievement (admin only)
router.post('/:userId/achievements', auth, async (req, res) => {
    try {
        // In a real app, you'd check for admin permissions here
        const { id, name, description, icon, rarity } = req.body;
        
        const profile = await UserProfile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        
        // Check if achievement already exists
        const existingAchievement = profile.achievements.find(a => a.id === id);
        if (existingAchievement) {
            return res.status(400).json({ message: 'Achievement already unlocked' });
        }
        
        const achievement = {
            id,
            name,
            description,
            icon,
            rarity: rarity || 'common'
        };
        
        profile.achievements.push(achievement);
        profile.stats.achievementsUnlocked += 1;
        
        // Add to recent activity
        profile.recentActivity.unshift({
            type: 'achievement_unlocked',
            description: `Unlocked achievement: ${name}`,
            relatedId: null
        });
        
        // Keep only last 20 activities
        if (profile.recentActivity.length > 20) {
            profile.recentActivity = profile.recentActivity.slice(0, 20);
        }
        
        await profile.save();
        
        res.status(201).json(achievement);
    } catch (error) {
        console.error('Error awarding achievement:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;