const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const Mod = require('../models/Mod');
const auth = require('../middleware/auth');

// Get all public collections
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            game, 
            category, 
            sort = 'newest',
            search 
        } = req.query;
        
        let query = { isPublic: true };
        
        if (game) query.gameTitle = game;
        if (category) query.category = category;
        if (search) {
            query.$text = { $search: search };
        }
        
        let sortOption = {};
        switch (sort) {
            case 'popular':
                sortOption = { likeCount: -1, downloads: -1 };
                break;
            case 'downloads':
                sortOption = { downloads: -1 };
                break;
            case 'rating':
                sortOption = { 'rating.average': -1, 'rating.count': -1 };
                break;
            default:
                sortOption = { isFeatured: -1, createdAt: -1 };
        }
        
        const collections = await Collection.find(query)
            .populate('mods.modId', 'title images price category')
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();
        
        const total = await Collection.countDocuments(query);
        
        res.json({
            collections,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
});

// Get featured collections
router.get('/featured', async (req, res) => {
    try {
        const collections = await Collection.find({ 
            isPublic: true, 
            isFeatured: true 
        })
        .populate('mods.modId', 'title images price category')
        .sort({ likeCount: -1, createdAt: -1 })
        .limit(6)
        .lean();
        
        res.json(collections);
    } catch (error) {
        console.error('Error fetching featured collections:', error);
        res.status(500).json({ error: 'Failed to fetch featured collections' });
    }
});

// Get user's collections
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { includePrivate = false } = req.query;
        
        let query = { creatorId: userId };
        
        // Only show private collections if requested by the owner
        if (!includePrivate || (req.user && req.user.id !== userId)) {
            query.isPublic = true;
        }
        
        const collections = await Collection.find(query)
            .populate('mods.modId', 'title images price category')
            .sort({ createdAt: -1 })
            .lean();
        
        res.json(collections);
    } catch (error) {
        console.error('Error fetching user collections:', error);
        res.status(500).json({ error: 'Failed to fetch user collections' });
    }
});

// Get single collection
router.get('/:id', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('mods.modId')
            .populate('creatorId', 'username avatar')
            .lean();
        
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        if (!collection.isPublic && (!req.user || req.user.id !== collection.creatorId.toString())) {
            return res.status(403).json({ error: 'Collection is private' });
        }
        
        // Increment view count
        await Collection.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        });
        
        res.json(collection);
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.status(500).json({ error: 'Failed to fetch collection' });
    }
});

// Create new collection
router.post('/', auth, async (req, res) => {
    try {
        const {
            name,
            description,
            gameTitle,
            category,
            tags,
            isPublic = true,
            mods = []
        } = req.body;
        
        if (!name || !gameTitle) {
            return res.status(400).json({ error: 'Name and game title are required' });
        }
        
        // Verify all mods exist
        if (mods.length > 0) {
            const modIds = mods.map(mod => mod.modId);
            const existingMods = await Mod.find({ _id: { $in: modIds } });
            
            if (existingMods.length !== modIds.length) {
                return res.status(400).json({ error: 'One or more mods not found' });
            }
        }
        
        const collection = new Collection({
            name,
            description,
            creatorId: req.user.id,
            creatorName: req.user.username,
            gameTitle,
            category,
            tags: tags || [],
            isPublic,
            mods: mods.map(mod => ({
                modId: mod.modId,
                note: mod.note || ''
            }))
        });
        
        await collection.save();
        
        res.status(201).json(collection);
    } catch (error) {
        console.error('Error creating collection:', error);
        res.status(500).json({ error: 'Failed to create collection' });
    }
});

// Update collection
router.put('/:id', auth, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        if (collection.creatorId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to edit this collection' });
        }
        
        const updates = req.body;
        delete updates.creatorId; // Prevent changing creator
        delete updates.creatorName;
        
        Object.assign(collection, updates);
        await collection.save();
        
        res.json(collection);
    } catch (error) {
        console.error('Error updating collection:', error);
        res.status(500).json({ error: 'Failed to update collection' });
    }
});

// Add mod to collection
router.post('/:id/mods', auth, async (req, res) => {
    try {
        const { modId, note } = req.body;
        
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        if (collection.creatorId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to edit this collection' });
        }
        
        // Check if mod exists
        const mod = await Mod.findById(modId);
        if (!mod) {
            return res.status(404).json({ error: 'Mod not found' });
        }
        
        // Check if mod is already in collection
        const existingMod = collection.mods.find(m => 
            m.modId.toString() === modId
        );
        
        if (existingMod) {
            return res.status(400).json({ error: 'Mod already in collection' });
        }
        
        collection.mods.push({
            modId,
            note: note || '',
            addedAt: new Date()
        });
        
        await collection.save();
        
        res.json(collection);
    } catch (error) {
        console.error('Error adding mod to collection:', error);
        res.status(500).json({ error: 'Failed to add mod to collection' });
    }
});

// Remove mod from collection
router.delete('/:id/mods/:modId', auth, async (req, res) => {
    try {
        const { id, modId } = req.params;
        
        const collection = await Collection.findById(id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        if (collection.creatorId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to edit this collection' });
        }
        
        collection.mods = collection.mods.filter(mod => 
            mod.modId.toString() !== modId
        );
        
        await collection.save();
        
        res.json(collection);
    } catch (error) {
        console.error('Error removing mod from collection:', error);
        res.status(500).json({ error: 'Failed to remove mod from collection' });
    }
});

// Like/unlike collection
router.post('/:id/like', auth, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        const userId = req.user.id;
        const existingLike = collection.likes.find(like => 
            like.userId.toString() === userId
        );
        
        if (existingLike) {
            // Unlike
            collection.likes = collection.likes.filter(like => 
                like.userId.toString() !== userId
            );
            collection.likeCount = Math.max(0, collection.likeCount - 1);
        } else {
            // Like
            collection.likes.push({ userId });
            collection.likeCount += 1;
        }
        
        await collection.save();
        
        res.json({ 
            liked: !existingLike,
            likeCount: collection.likeCount 
        });
    } catch (error) {
        console.error('Error toggling collection like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

// Delete collection
router.delete('/:id', auth, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        if (collection.creatorId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this collection' });
        }
        
        await Collection.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        console.error('Error deleting collection:', error);
        res.status(500).json({ error: 'Failed to delete collection' });
    }
});

module.exports = router;