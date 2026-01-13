const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creatorName: {
        type: String,
        required: true
    },
    mods: [{
        modId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mod'
        },
        addedAt: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    coverImage: {
        type: String,
        default: '/images/default-collection.jpg'
    },
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        enum: ['Graphics Enhancement', 'Gameplay Overhaul', 'Quality of Life', 'Immersion Pack', 'Performance', 'Content Addition', 'Bug Fixes', 'Mixed', 'Other'],
        default: 'Mixed'
    },
    gameTitle: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    installOrder: [{
        modId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mod'
        },
        step: Number,
        instructions: String
    }],
    compatibility: {
        gameVersions: [String],
        totalSize: String,
        estimatedInstallTime: String,
        difficulty: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            default: 'Beginner'
        }
    }
}, {
    timestamps: true
});

// Indexes for search and performance
collectionSchema.index({ name: 'text', description: 'text', tags: 'text' });
collectionSchema.index({ gameTitle: 1, isPublic: 1 });
collectionSchema.index({ creatorId: 1 });
collectionSchema.index({ isFeatured: 1, likeCount: -1 });

module.exports = mongoose.model('Collection', collectionSchema);