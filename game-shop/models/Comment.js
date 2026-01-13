const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
    username: {
        type: String,
        required: true
    },
    userAvatar: {
        type: String,
        default: '/images/default-avatar.png'
    },
    content: {
        type: String,
        required: true,
        maxlength: 2000
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
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
    isEdited: {
        type: Boolean,
        default: false
    },
    editHistory: [{
        content: String,
        editedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    isPinned: {
        type: Boolean,
        default: false
    },
    isReported: {
        type: Boolean,
        default: false
    },
    reports: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: {
            type: String,
            enum: ['spam', 'inappropriate', 'harassment', 'misinformation', 'other']
        },
        description: String,
        reportedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Indexes for performance
commentSchema.index({ modId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentId: 1 });

module.exports = mongoose.model('Comment', commentSchema);