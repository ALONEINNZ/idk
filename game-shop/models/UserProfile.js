const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        maxlength: 500,
        default: ''
    },
    avatar: {
        type: String,
        default: '/images/default-avatar.png'
    },
    banner: {
        type: String,
        default: '/images/default-banner.jpg'
    },
    location: {
        type: String,
        maxlength: 100
    },
    website: {
        type: String,
        maxlength: 200
    },
    socialLinks: {
        twitter: String,
        youtube: String,
        twitch: String,
        discord: String,
        github: String
    },
    preferences: {
        theme: {
            type: String,
            enum: ['dark', 'light', 'auto'],
            default: 'dark'
        },
        language: {
            type: String,
            default: 'en'
        },
        emailNotifications: {
            type: Boolean,
            default: true
        },
        showProfile: {
            type: Boolean,
            default: true
        }
    },
    stats: {
        modsCreated: {
            type: Number,
            default: 0
        },
        modsDownloaded: {
            type: Number,
            default: 0
        },
        totalDownloads: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0
        },
        reviewsGiven: {
            type: Number,
            default: 0
        },
        achievementsUnlocked: {
            type: Number,
            default: 0
        }
    },
    achievements: [{
        id: String,
        name: String,
        description: String,
        icon: String,
        unlockedAt: {
            type: Date,
            default: Date.now
        },
        rarity: {
            type: String,
            enum: ['common', 'rare', 'epic', 'legendary'],
            default: 'common'
        }
    }],
    badges: [{
        id: String,
        name: String,
        color: String,
        icon: String
    }],
    favoriteGames: [{
        type: String,
        trim: true
    }],
    followedCreators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    modCollections: [{
        name: String,
        description: String,
        mods: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mod'
        }],
        isPublic: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    recentActivity: [{
        type: {
            type: String,
            enum: ['mod_created', 'mod_updated', 'review_posted', 'achievement_unlocked', 'collection_created']
        },
        description: String,
        relatedId: mongoose.Schema.Types.ObjectId,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    reputation: {
        score: {
            type: Number,
            default: 0
        },
        level: {
            type: String,
            enum: ['Newcomer', 'Contributor', 'Veteran', 'Expert', 'Legend'],
            default: 'Newcomer'
        }
    }
}, {
    timestamps: true
});

// Index for search and performance
userProfileSchema.index({ displayName: 'text', bio: 'text' });
userProfileSchema.index({ 'stats.totalDownloads': -1 });
userProfileSchema.index({ 'reputation.score': -1 });

module.exports = mongoose.model('UserProfile', userProfileSchema);