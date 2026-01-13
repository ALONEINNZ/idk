const UserProfile = require('../models/UserProfile');
const Mod = require('../models/Mod');
const ModReview = require('../models/ModReview');

// Achievement definitions
const ACHIEVEMENTS = {
    // Creator achievements
    FIRST_MOD: {
        id: 'first_mod',
        name: 'First Creation',
        description: 'Published your first mod',
        icon: '🎯',
        rarity: 'common'
    },
    MOD_MASTER: {
        id: 'mod_master',
        name: 'Mod Master',
        description: 'Published 10 mods',
        icon: '👑',
        rarity: 'rare'
    },
    LEGENDARY_CREATOR: {
        id: 'legendary_creator',
        name: 'Legendary Creator',
        description: 'Published 50 mods',
        icon: '🏆',
        rarity: 'legendary'
    },
    
    // Download achievements
    POPULAR_MOD: {
        id: 'popular_mod',
        name: 'Popular Creator',
        description: 'One of your mods reached 1,000 downloads',
        icon: '⭐',
        rarity: 'rare'
    },
    VIRAL_HIT: {
        id: 'viral_hit',
        name: 'Viral Hit',
        description: 'One of your mods reached 10,000 downloads',
        icon: '🚀',
        rarity: 'epic'
    },
    DOWNLOAD_LEGEND: {
        id: 'download_legend',
        name: 'Download Legend',
        description: 'Total downloads across all mods reached 100,000',
        icon: '💎',
        rarity: 'legendary'
    },
    
    // Rating achievements
    FIVE_STAR_CREATOR: {
        id: 'five_star_creator',
        name: 'Five Star Creator',
        description: 'Maintained 4.5+ average rating across 5+ mods',
        icon: '⭐',
        rarity: 'epic'
    },
    
    // Community achievements
    HELPFUL_REVIEWER: {
        id: 'helpful_reviewer',
        name: 'Helpful Reviewer',
        description: 'Posted 25 helpful reviews',
        icon: '📝',
        rarity: 'rare'
    },
    COMMUNITY_CHAMPION: {
        id: 'community_champion',
        name: 'Community Champion',
        description: 'Received 100 followers',
        icon: '👥',
        rarity: 'epic'
    },
    
    // Special achievements
    EARLY_ADOPTER: {
        id: 'early_adopter',
        name: 'Early Adopter',
        description: 'Joined ExusCraft in the first month',
        icon: '🌟',
        rarity: 'legendary'
    },
    BETA_TESTER: {
        id: 'beta_tester',
        name: 'Beta Tester',
        description: 'Participated in beta testing',
        icon: '🧪',
        rarity: 'epic'
    }
};

// Badge definitions
const BADGES = {
    VERIFIED_CREATOR: {
        id: 'verified_creator',
        name: 'Verified Creator',
        color: '#3B82F6',
        icon: '✓'
    },
    TOP_CONTRIBUTOR: {
        id: 'top_contributor',
        name: 'Top Contributor',
        color: '#F59E0B',
        icon: '🏅'
    },
    COMMUNITY_MODERATOR: {
        id: 'community_moderator',
        name: 'Community Moderator',
        color: '#10B981',
        icon: '🛡️'
    },
    FEATURED_CREATOR: {
        id: 'featured_creator',
        name: 'Featured Creator',
        color: '#8B5CF6',
        icon: '⭐'
    }
};

class AchievementSystem {
    // Check and award achievements for a user
    static async checkAchievements(userId, triggerType, data = {}) {
        try {
            const profile = await UserProfile.findOne({ userId });
            if (!profile) return;
            
            const userMods = await Mod.find({ authorId: userId, approved: true });
            const userReviews = await ModReview.find({ userId, status: 'active' });
            
            const newAchievements = [];
            
            // Check creator achievements
            if (triggerType === 'mod_published') {
                newAchievements.push(...this.checkCreatorAchievements(profile, userMods));
            }
            
            // Check download achievements
            if (triggerType === 'mod_downloaded') {
                newAchievements.push(...this.checkDownloadAchievements(profile, userMods));
            }
            
            // Check rating achievements
            if (triggerType === 'mod_rated') {
                newAchievements.push(...this.checkRatingAchievements(profile, userMods));
            }
            
            // Check community achievements
            if (triggerType === 'review_posted') {
                newAchievements.push(...this.checkCommunityAchievements(profile, userReviews));
            }
            
            // Award new achievements
            for (const achievement of newAchievements) {
                await this.awardAchievement(userId, achievement);
            }
            
            // Update reputation based on achievements
            await this.updateReputation(userId);
            
            return newAchievements;
        } catch (error) {
            console.error('Error checking achievements:', error);
            return [];
        }
    }
    
    static checkCreatorAchievements(profile, userMods) {
        const achievements = [];
        const modCount = userMods.length;
        
        // First mod
        if (modCount >= 1 && !this.hasAchievement(profile, 'first_mod')) {
            achievements.push(ACHIEVEMENTS.FIRST_MOD);
        }
        
        // Mod master
        if (modCount >= 10 && !this.hasAchievement(profile, 'mod_master')) {
            achievements.push(ACHIEVEMENTS.MOD_MASTER);
        }
        
        // Legendary creator
        if (modCount >= 50 && !this.hasAchievement(profile, 'legendary_creator')) {
            achievements.push(ACHIEVEMENTS.LEGENDARY_CREATOR);
        }
        
        return achievements;
    }
    
    static checkDownloadAchievements(profile, userMods) {
        const achievements = [];
        const totalDownloads = userMods.reduce((sum, mod) => sum + (mod.downloads || 0), 0);
        const maxDownloads = Math.max(...userMods.map(mod => mod.downloads || 0));
        
        // Popular mod
        if (maxDownloads >= 1000 && !this.hasAchievement(profile, 'popular_mod')) {
            achievements.push(ACHIEVEMENTS.POPULAR_MOD);
        }
        
        // Viral hit
        if (maxDownloads >= 10000 && !this.hasAchievement(profile, 'viral_hit')) {
            achievements.push(ACHIEVEMENTS.VIRAL_HIT);
        }
        
        // Download legend
        if (totalDownloads >= 100000 && !this.hasAchievement(profile, 'download_legend')) {
            achievements.push(ACHIEVEMENTS.DOWNLOAD_LEGEND);
        }
        
        return achievements;
    }
    
    static checkRatingAchievements(profile, userMods) {
        const achievements = [];
        
        if (userMods.length >= 5) {
            const averageRating = userMods.reduce((sum, mod) => sum + (mod.rating || 0), 0) / userMods.length;
            
            if (averageRating >= 4.5 && !this.hasAchievement(profile, 'five_star_creator')) {
                achievements.push(ACHIEVEMENTS.FIVE_STAR_CREATOR);
            }
        }
        
        return achievements;
    }
    
    static checkCommunityAchievements(profile, userReviews) {
        const achievements = [];
        
        // Helpful reviewer
        if (userReviews.length >= 25 && !this.hasAchievement(profile, 'helpful_reviewer')) {
            achievements.push(ACHIEVEMENTS.HELPFUL_REVIEWER);
        }
        
        // Community champion
        if (profile.followers.length >= 100 && !this.hasAchievement(profile, 'community_champion')) {
            achievements.push(ACHIEVEMENTS.COMMUNITY_CHAMPION);
        }
        
        return achievements;
    }
    
    static hasAchievement(profile, achievementId) {
        return profile.achievements.some(achievement => achievement.id === achievementId);
    }
    
    static async awardAchievement(userId, achievement) {
        try {
            const profile = await UserProfile.findOne({ userId });
            if (!profile || this.hasAchievement(profile, achievement.id)) {
                return;
            }
            
            profile.achievements.push({
                id: achievement.id,
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                rarity: achievement.rarity
            });
            
            profile.stats.achievementsUnlocked += 1;
            
            // Add to recent activity
            profile.recentActivity.unshift({
                type: 'achievement_unlocked',
                description: `Unlocked achievement: ${achievement.name}`,
                relatedId: null
            });
            
            // Keep only last 20 activities
            if (profile.recentActivity.length > 20) {
                profile.recentActivity = profile.recentActivity.slice(0, 20);
            }
            
            await profile.save();
            
            console.log(`Achievement awarded: ${achievement.name} to user ${userId}`);
        } catch (error) {
            console.error('Error awarding achievement:', error);
        }
    }
    
    static async awardBadge(userId, badgeId) {
        try {
            const badge = BADGES[badgeId];
            if (!badge) return;
            
            const profile = await UserProfile.findOne({ userId });
            if (!profile) return;
            
            // Check if user already has this badge
            const hasBadge = profile.badges.some(b => b.id === badge.id);
            if (hasBadge) return;
            
            profile.badges.push({
                id: badge.id,
                name: badge.name,
                color: badge.color,
                icon: badge.icon
            });
            
            await profile.save();
            
            console.log(`Badge awarded: ${badge.name} to user ${userId}`);
        } catch (error) {
            console.error('Error awarding badge:', error);
        }
    }
    
    static async updateReputation(userId) {
        try {
            const profile = await UserProfile.findOne({ userId });
            if (!profile) return;
            
            // Calculate reputation score based on various factors
            let score = 0;
            
            // Base score from achievements
            score += profile.achievements.length * 10;
            
            // Bonus for rare achievements
            profile.achievements.forEach(achievement => {
                switch (achievement.rarity) {
                    case 'rare': score += 25; break;
                    case 'epic': score += 50; break;
                    case 'legendary': score += 100; break;
                }
            });
            
            // Score from stats
            score += profile.stats.modsCreated * 20;
            score += Math.floor(profile.stats.totalDownloads / 100);
            score += profile.stats.reviewsGiven * 5;
            score += profile.followers.length * 2;
            
            // Determine reputation level
            let level = 'Newcomer';
            if (score >= 1000) level = 'Legend';
            else if (score >= 500) level = 'Expert';
            else if (score >= 200) level = 'Veteran';
            else if (score >= 50) level = 'Contributor';
            
            profile.reputation.score = score;
            profile.reputation.level = level;
            
            await profile.save();
        } catch (error) {
            console.error('Error updating reputation:', error);
        }
    }
    
    // Get all available achievements
    static getAllAchievements() {
        return Object.values(ACHIEVEMENTS);
    }
    
    // Get all available badges
    static getAllBadges() {
        return Object.values(BADGES);
    }
}

module.exports = { AchievementSystem, ACHIEVEMENTS, BADGES };