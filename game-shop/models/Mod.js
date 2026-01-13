const mongoose = require('mongoose');

const modSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: 200
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true,
        enum: ['Graphics', 'Gameplay', 'UI/UX', 'Audio', 'Maps', 'Characters', 'Weapons', 'Vehicles', 'Total Conversion', 'Utility']
    },
    gameTitle: {
        type: String,
        required: true
    },
    gameEngine: {
        type: String,
        required: true,
        enum: ['Unity', 'Unreal Engine', 'Source', 'Creation Engine', 'REDengine', 'Frostbite', 'CryEngine', 'Godot', 'GameMaker', 'Custom']
    },
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    screenshots: [{
        url: String,
        caption: String,
        type: {
            type: String,
            enum: ['before', 'after', 'gameplay', 'ui', 'comparison'],
            default: 'gameplay'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    videos: [{
        url: String,
        title: String,
        type: {
            type: String,
            enum: ['trailer', 'gameplay', 'tutorial', 'showcase'],
            default: 'showcase'
        },
        thumbnail: String,
        duration: String
    }],
    downloadUrl: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true,
        default: '1.0.0'
    },
    requirements: {
        gameVersion: String,
        dependencies: [String],
        installation: String,
        compatibility: [String]
    },
    tags: [{
        type: String,
        trim: true
    }],
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
        },
        breakdown: {
            five: { type: Number, default: 0 },
            four: { type: Number, default: 0 },
            three: { type: Number, default: 0 },
            two: { type: Number, default: 0 },
            one: { type: Number, default: 0 }
        }
    },
    downloads: {
        type: Number,
        default: 0
    },
    performance: {
        fpsImpact: {
            type: String,
            enum: ['None', 'Low', 'Medium', 'High'],
            default: 'None'
        },
        memoryUsage: String,
        loadTime: String,
        systemRequirements: {
            minimum: String,
            recommended: String
        }
    },
    compatibility: {
        gameVersions: [String],
        conflictsWith: [{
            modId: mongoose.Schema.Types.ObjectId,
            modName: String,
            severity: {
                type: String,
                enum: ['minor', 'major', 'critical'],
                default: 'minor'
            }
        }],
        dependencies: [{
            modId: mongoose.Schema.Types.ObjectId,
            modName: String,
            required: Boolean,
            minVersion: String
        }]
    },
    featured: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    changelog: [{
        version: String,
        date: Date,
        changes: [String]
    }],
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index for search functionality
modSchema.index({ title: 'text', description: 'text', tags: 'text' });
modSchema.index({ category: 1, gameTitle: 1 });
modSchema.index({ featured: 1, approved: 1, active: 1 });

module.exports = mongoose.model('Mod', modSchema);