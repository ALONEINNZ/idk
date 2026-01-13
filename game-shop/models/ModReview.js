const mongoose = require('mongoose');

const modReviewSchema = new mongoose.Schema({
    modId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mod',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000,
        trim: true
    },
    pros: [{
        type: String,
        maxlength: 200
    }],
    cons: [{
        type: String,
        maxlength: 200
    }],
    screenshots: [{
        url: String,
        caption: String
    }],
    gameVersion: {
        type: String,
        required: true
    },
    modVersion: {
        type: String,
        required: true
    },
    systemSpecs: {
        cpu: String,
        gpu: String,
        ram: String,
        os: String
    },
    performanceImpact: {
        fps: {
            before: Number,
            after: Number
        },
        loadTime: {
            before: Number,
            after: Number
        },
        stability: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair', 'Poor'],
            default: 'Good'
        }
    },
    helpfulVotes: {
        up: {
            type: Number,
            default: 0
        },
        down: {
            type: Number,
            default: 0
        },
        voters: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            vote: {
                type: String,
                enum: ['up', 'down']
            }
        }]
    },
    verified: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    replies: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            maxlength: 1000
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        isCreatorReply: {
            type: Boolean,
            default: false
        }
    }],
    flags: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: {
            type: String,
            enum: ['spam', 'inappropriate', 'fake', 'offensive', 'other']
        },
        description: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'hidden', 'deleted', 'pending'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate reviews
modReviewSchema.index({ modId: 1, userId: 1 }, { unique: true });
modReviewSchema.index({ rating: -1 });
modReviewSchema.index({ 'helpfulVotes.up': -1 });
modReviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ModReview', modReviewSchema);