const express = require('express');
const multer = require('multer');
const path = require('path');
const Mod = require('../models/Mod');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'images') {
            cb(null, 'uploads/mod-images/');
        } else if (file.fieldname === 'modFile') {
            cb(null, 'uploads/mod-files/');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'images') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed for mod images'));
            }
        } else if (file.fieldname === 'modFile') {
            const allowedTypes = ['.zip', '.rar', '.7z'];
            const ext = path.extname(file.originalname).toLowerCase();
            if (allowedTypes.includes(ext)) {
                cb(null, true);
            } else {
                cb(new Error('Only ZIP, RAR, and 7Z files are allowed for mod files'));
            }
        } else {
            cb(null, true);
        }
    }
});

// Get all approved mods
router.get('/', async (req, res) => {
    try {
        const { category, search, featured, page = 1, limit = 12, gameTitle } = req.query;
        
        let query = { approved: true, active: true };
        
        if (category) {
            query.category = category;
        }
        
        if (gameTitle) {
            query.gameTitle = new RegExp(gameTitle, 'i');
        }
        
        if (featured) {
            query.featured = true;
        }
        
        if (search) {
            query.$text = { $search: search };
        }

        const startIndex = (page - 1) * limit;
        const mods = await Mod.find(query)
            .populate('authorId', 'username')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(parseInt(limit));

        const total = await Mod.countDocuments(query);

        res.json({
            mods,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error('Error fetching mods:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single mod
router.get('/:id', async (req, res) => {
    try {
        const mod = await Mod.findById(req.params.id)
            .populate('authorId', 'username')
            .populate('reviews.userId', 'username');
        
        if (!mod || !mod.approved || !mod.active) {
            return res.status(404).json({ message: 'Mod not found' });
        }
        
        res.json(mod);
    } catch (error) {
        console.error('Error fetching mod:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload new mod (admin only)
router.post('/upload', auth, adminAuth, upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'modFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            title,
            description,
            shortDescription,
            price,
            category,
            gameTitle,
            gameEngine,
            author,
            tags,
            version = '1.0.0'
        } = req.body;

        // Process uploaded files
        const images = req.files.images ? req.files.images.map(file => `/uploads/mod-images/${file.filename}`) : [];
        const modFile = req.files.modFile ? `/uploads/mod-files/${req.files.modFile[0].filename}` : '';

        if (images.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        if (!modFile) {
            return res.status(400).json({ message: 'Mod file is required' });
        }

        // Get file size
        const fileSize = req.files.modFile[0].size;
        const fileSizeFormatted = formatFileSize(fileSize);

        const mod = new Mod({
            title,
            description,
            shortDescription,
            price: parseFloat(price) || 0,
            isFree: parseFloat(price) === 0,
            category,
            gameTitle,
            gameEngine,
            author,
            authorId: req.userId,
            images,
            downloadUrl: modFile,
            fileSize: fileSizeFormatted,
            version,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            approved: true, // Auto-approve admin uploads
            featured: false
        });

        await mod.save();

        res.status(201).json({
            message: 'Mod uploaded successfully',
            mod
        });
    } catch (error) {
        console.error('Error uploading mod:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

// Get all mods for admin management
router.get('/admin/all', auth, adminAuth, async (req, res) => {
    try {
        const mods = await Mod.find()
            .populate('authorId', 'username')
            .sort({ createdAt: -1 });
        
        res.json(mods);
    } catch (error) {
        console.error('Error fetching admin mods:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve mod
router.post('/:id/approve', auth, adminAuth, async (req, res) => {
    try {
        const mod = await Mod.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );
        
        if (!mod) {
            return res.status(404).json({ message: 'Mod not found' });
        }
        
        res.json({ message: 'Mod approved successfully', mod });
    } catch (error) {
        console.error('Error approving mod:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle featured status
router.post('/:id/feature', auth, adminAuth, async (req, res) => {
    try {
        const { featured } = req.body;
        
        const mod = await Mod.findByIdAndUpdate(
            req.params.id,
            { featured },
            { new: true }
        );
        
        if (!mod) {
            return res.status(404).json({ message: 'Mod not found' });
        }
        
        res.json({ message: 'Featured status updated', mod });
    } catch (error) {
        console.error('Error updating featured status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete mod
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const mod = await Mod.findByIdAndDelete(req.params.id);
        
        if (!mod) {
            return res.status(404).json({ message: 'Mod not found' });
        }
        
        res.json({ message: 'Mod deleted successfully' });
    } catch (error) {
        console.error('Error deleting mod:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Download mod (increment download count)
router.post('/:id/download', auth, async (req, res) => {
    try {
        const mod = await Mod.findById(req.params.id);
        
        if (!mod || !mod.approved || !mod.active) {
            return res.status(404).json({ message: 'Mod not found' });
        }
        
        // Increment download count
        mod.downloads += 1;
        await mod.save();
        
        res.json({
            message: 'Download started',
            downloadUrl: mod.downloadUrl,
            mod: {
                title: mod.title,
                version: mod.version,
                fileSize: mod.fileSize
            }
        });
    } catch (error) {
        console.error('Error processing download:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Rate a mod
router.post('/:id/rate', auth, async (req, res) => {
    try {
        const { rating, review } = req.body;
        const modId = req.params.id;
        const userId = req.user.id;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        
        const mod = await Mod.findById(modId);
        if (!mod) {
            return res.status(404).json({ message: 'Mod not found' });
        }
        
        // Check if user already rated this mod
        const existingReviewIndex = mod.reviews.findIndex(r => 
            r.userId.toString() === userId
        );
        
        if (existingReviewIndex !== -1) {
            // Update existing rating
            const oldRating = mod.reviews[existingReviewIndex].rating;
            mod.reviews[existingReviewIndex].rating = rating;
            mod.reviews[existingReviewIndex].comment = review || '';
            mod.reviews[existingReviewIndex].date = new Date();
            
            // Update rating breakdown
            mod.rating.breakdown[getRatingKey(oldRating)] -= 1;
            mod.rating.breakdown[getRatingKey(rating)] += 1;
        } else {
            // Add new rating
            mod.reviews.push({
                userId,
                username: req.user.username,
                rating,
                comment: review || '',
                date: new Date()
            });
            
            mod.rating.count += 1;
            mod.rating.breakdown[getRatingKey(rating)] += 1;
        }
        
        // Recalculate average rating
        const totalRatings = mod.reviews.reduce((sum, r) => sum + r.rating, 0);
        mod.rating.average = totalRatings / mod.reviews.length;
        
        await mod.save();
        
        res.json({
            message: 'Rating submitted successfully',
            rating: mod.rating
        });
    } catch (error) {
        console.error('Error rating mod:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload screenshots for a mod
router.post('/:id/screenshots', auth, adminAuth, upload.array('screenshots', 10), async (req, res) => {
    try {
        const modId = req.params.id;
        const { captions, types } = req.body;
        
        const mod = await Mod.findById(modId);
        if (!mod) {
            return res.status(404).json({ message: 'Mod not found' });
        }
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No screenshots uploaded' });
        }
        
        const screenshots = req.files.map((file, index) => ({
            url: `/uploads/mod-images/${file.filename}`,
            caption: captions ? captions[index] || '' : '',
            type: types ? types[index] || 'gameplay' : 'gameplay',
            uploadedAt: new Date()
        }));
        
        mod.screenshots.push(...screenshots);
        await mod.save();
        
        res.json({
            message: 'Screenshots uploaded successfully',
            screenshots
        });
    } catch (error) {
        console.error('Error uploading screenshots:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get mod statistics
router.get('/:id/stats', async (req, res) => {
    try {
        const mod = await Mod.findById(req.params.id);
        if (!mod) {
            return res.status(404).json({ message: 'Mod not found' });
        }
        
        const stats = {
            downloads: mod.downloads,
            rating: mod.rating,
            reviewCount: mod.reviews.length,
            screenshotCount: mod.screenshots.length,
            videoCount: mod.videos.length,
            createdAt: mod.createdAt,
            lastUpdated: mod.updatedAt
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching mod stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper function to get rating key
function getRatingKey(rating) {
    const keys = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five' };
    return keys[rating];
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = router;