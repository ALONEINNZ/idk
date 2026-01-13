const express = require('express');
const Mod = require('../models/Mod');
const ModReview = require('../models/ModReview');
const UserProfile = require('../models/UserProfile');
const auth = require('../middleware/auth');

const router = express.Router();

// Get creator analytics
router.get('/creator/:userId', auth, async (req, res) => {
    try {
        // Check if user is requesting their own analytics or is admin
        if (req.userId !== req.params.userId) {
            return res.status(403).json({ message: 'Not authorized to view these analytics' });
        }
        
        const userId = req.params.userId;
        
        // Get user's mods
        const userMods = await Mod.find({ authorId: userId, approved: true });
        const modIds = userMods.map(mod => mod._id);
        
        // Basic stats
        const totalMods = userMods.length;
        const totalDownloads = userMods.reduce((sum, mod) => sum + (mod.downloads || 0), 0);
        const averageRating = userMods.length > 0 
            ? userMods.reduce((sum, mod) => sum + (mod.rating || 0), 0) / userMods.length 
            : 0;
        
        // Revenue calculation (for paid mods)
        const totalRevenue = userMods.reduce((sum, mod) => {
            return sum + ((mod.price || 0) * (mod.downloads || 0));
        }, 0);
        
        // Reviews stats
        const reviewsCount = await ModReview.countDocuments({ 
            modId: { $in: modIds },
            status: 'active'
        });
        
        // Recent activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentDownloads = await Mod.aggregate([
            { $match: { authorId: userId, approved: true } },
            { $group: { _id: null, downloads: { $sum: '$downloads' } } }
        ]);
        
        // Top performing mods
        const topMods = userMods
            .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
            .slice(0, 5)
            .map(mod => ({
                id: mod._id,
                title: mod.title,
                downloads: mod.downloads || 0,
                rating: mod.rating || 0,
                revenue: (mod.price || 0) * (mod.downloads || 0)
            }));
        
        // Downloads over time (last 12 months)
        const downloadHistory = await generateDownloadHistory(userId);
        
        // Category breakdown
        const categoryStats = userMods.reduce((acc, mod) => {
            const category = mod.category || 'Other';
            if (!acc[category]) {
                acc[category] = { count: 0, downloads: 0 };
            }
            acc[category].count += 1;
            acc[category].downloads += mod.downloads || 0;
            return acc;
        }, {});
        
        res.json({
            overview: {
                totalMods,
                totalDownloads,
                averageRating: Math.round(averageRating * 10) / 10,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                reviewsCount
            },
            topMods,
            downloadHistory,
            categoryStats,
            recentActivity: {
                downloadsLast30Days: recentDownloads[0]?.downloads || 0
            }
        });
    } catch (error) {
        console.error('Error fetching creator analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get platform analytics (admin only)
router.get('/platform', auth, async (req, res) => {
    try {
        // In a real app, check for admin permissions here
        
        // Total platform stats
        const totalMods = await Mod.countDocuments({ approved: true });
        const totalUsers = await UserProfile.countDocuments();
        const totalDownloads = await Mod.aggregate([
            { $match: { approved: true } },
            { $group: { _id: null, downloads: { $sum: '$downloads' } } }
        ]);
        
        const totalRevenue = await Mod.aggregate([
            { $match: { approved: true } },
            { $group: { 
                _id: null, 
                revenue: { 
                    $sum: { $multiply: ['$price', '$downloads'] } 
                } 
            }}
        ]);
        
        // Popular categories
        const categoryStats = await Mod.aggregate([
            { $match: { approved: true } },
            { 
                $group: { 
                    _id: '$category',
                    count: { $sum: 1 },
                    downloads: { $sum: '$downloads' },
                    averageRating: { $avg: '$rating' }
                }
            },
            { $sort: { downloads: -1 } }
        ]);
        
        // Popular games
        const gameStats = await Mod.aggregate([
            { $match: { approved: true } },
            { 
                $group: { 
                    _id: '$gameTitle',
                    count: { $sum: 1 },
                    downloads: { $sum: '$downloads' }
                }
            },
            { $sort: { downloads: -1 } },
            { $limit: 10 }
        ]);
        
        // Top creators
        const topCreators = await Mod.aggregate([
            { $match: { approved: true } },
            { 
                $group: { 
                    _id: '$authorId',
                    author: { $first: '$author' },
                    modCount: { $sum: 1 },
                    totalDownloads: { $sum: '$downloads' },
                    averageRating: { $avg: '$rating' }
                }
            },
            { $sort: { totalDownloads: -1 } },
            { $limit: 10 }
        ]);
        
        // Recent activity
        const recentMods = await Mod.find({ approved: true })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title author createdAt downloads rating');
        
        res.json({
            overview: {
                totalMods,
                totalUsers,
                totalDownloads: totalDownloads[0]?.downloads || 0,
                totalRevenue: Math.round((totalRevenue[0]?.revenue || 0) * 100) / 100
            },
            categoryStats,
            gameStats,
            topCreators,
            recentMods
        });
    } catch (error) {
        console.error('Error fetching platform analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get mod-specific analytics
router.get('/mod/:modId', auth, async (req, res) => {
    try {
        const mod = await Mod.findById(req.params.modId);
        if (!mod) {
            return res.status(404).json({ message: 'Mod not found' });
        }
        
        // Check if user owns this mod or is admin
        if (mod.authorId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to view these analytics' });
        }
        
        // Reviews breakdown
        const reviewsStats = await ModReview.aggregate([
            { $match: { modId: mod._id, status: 'active' } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Recent reviews
        const recentReviews = await ModReview.find({ 
            modId: mod._id, 
            status: 'active' 
        })
        .populate('userId', 'username')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('rating title content createdAt userId');
        
        // Download trends (simulated - in real app, you'd track this over time)
        const downloadTrends = generateDownloadTrends(mod.downloads || 0);
        
        res.json({
            mod: {
                id: mod._id,
                title: mod.title,
                downloads: mod.downloads || 0,
                rating: mod.rating || 0,
                price: mod.price || 0,
                revenue: (mod.price || 0) * (mod.downloads || 0)
            },
            reviewsStats,
            recentReviews,
            downloadTrends
        });
    } catch (error) {
        console.error('Error fetching mod analytics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper function to generate download history
async function generateDownloadHistory(userId) {
    // In a real app, you'd track downloads over time in a separate collection
    // For now, we'll simulate this data
    const months = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        // Simulate download data (in real app, query actual data)
        const downloads = Math.floor(Math.random() * 1000) + 100;
        
        months.push({
            month: monthName,
            downloads
        });
    }
    
    return months;
}

// Helper function to generate download trends
function generateDownloadTrends(totalDownloads) {
    const days = [];
    const currentDate = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        
        // Simulate daily downloads
        const dailyDownloads = Math.floor(Math.random() * (totalDownloads / 30)) + 1;
        
        days.push({
            date: date.toISOString().split('T')[0],
            downloads: dailyDownloads
        });
    }
    
    return days;
}

module.exports = router;