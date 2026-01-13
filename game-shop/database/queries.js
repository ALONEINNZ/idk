const { db } = require('./init');

// User queries
const userQueries = {
    // Create new user
    createUser: (userData) => {
        return new Promise((resolve, reject) => {
            const { username, email, password_hash, first_name, last_name } = userData;
            db.run(`INSERT INTO users (username, email, password_hash, first_name, last_name) 
                    VALUES (?, ?, ?, ?, ?)`, 
                [username, email, password_hash, first_name, last_name], 
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...userData });
                });
        });
    },

    // Find user by email
    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Find user by username
    findByUsername: (username) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Find user by ID
    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Update user profile
    updateProfile: (userId, updates) => {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updates);
            values.push(userId);

            db.run(`UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
                values, function(err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                });
        });
    },

    // Update last login
    updateLastLogin: (userId) => {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE users SET last_login = CURRENT_TIMESTAMP, login_count = login_count + 1 WHERE id = ?`, 
                [userId], function(err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                });
        });
    },

    // Get user with purchases
    getUserWithPurchases: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.*, 
                       GROUP_CONCAT(g.title) as purchased_games,
                       COUNT(up.game_id) as total_purchases
                FROM users u
                LEFT JOIN user_purchases up ON u.id = up.user_id
                LEFT JOIN games g ON up.game_id = g.id
                WHERE u.id = ?
                GROUP BY u.id
            `;
            db.get(query, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

// Game queries
const gameQueries = {
    // Get all games with filters
    getGames: (filters = {}) => {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM games WHERE is_active = 1`;
            let params = [];

            if (filters.category) {
                query += ` AND category = ?`;
                params.push(filters.category);
            }

            if (filters.featured) {
                query += ` AND is_featured = 1`;
            }

            if (filters.search) {
                query += ` AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)`;
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            if (filters.priceMin) {
                query += ` AND price >= ?`;
                params.push(filters.priceMin);
            }

            if (filters.priceMax) {
                query += ` AND price <= ?`;
                params.push(filters.priceMax);
            }

            query += ` ORDER BY `;
            switch (filters.sortBy) {
                case 'price_asc':
                    query += `price ASC`;
                    break;
                case 'price_desc':
                    query += `price DESC`;
                    break;
                case 'rating':
                    query += `user_rating DESC`;
                    break;
                case 'newest':
                    query += `release_date DESC`;
                    break;
                default:
                    query += `created_at DESC`;
            }

            if (filters.limit) {
                query += ` LIMIT ?`;
                params.push(filters.limit);
            }

            if (filters.offset) {
                query += ` OFFSET ?`;
                params.push(filters.offset);
            }

            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else {
                    // Parse JSON fields
                    const games = rows.map(game => ({
                        ...game,
                        images: JSON.parse(game.images || '[]'),
                        tags: JSON.parse(game.tags || '[]'),
                        features: JSON.parse(game.features || '[]'),
                        languages: JSON.parse(game.languages || '[]'),
                        system_requirements: JSON.parse(game.system_requirements || '{}')
                    }));
                    resolve(games);
                }
            });
        });
    },

    // Get game by ID
    getById: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM games WHERE id = ? AND is_active = 1`, [id], (err, row) => {
                if (err) reject(err);
                else if (row) {
                    // Parse JSON fields
                    const game = {
                        ...row,
                        images: JSON.parse(row.images || '[]'),
                        tags: JSON.parse(row.tags || '[]'),
                        features: JSON.parse(row.features || '[]'),
                        languages: JSON.parse(row.languages || '[]'),
                        system_requirements: JSON.parse(row.system_requirements || '{}')
                    };
                    resolve(game);
                } else {
                    resolve(null);
                }
            });
        });
    },

    // Create new game
    createGame: (gameData) => {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(gameData).join(', ');
            const placeholders = Object.keys(gameData).map(() => '?').join(', ');
            const values = Object.values(gameData);

            db.run(`INSERT INTO games (${fields}) VALUES (${placeholders})`, 
                values, function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...gameData });
                });
        });
    },

    // Update game
    updateGame: (gameId, updates) => {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updates);
            values.push(gameId);

            db.run(`UPDATE games SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
                values, function(err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                });
        });
    },

    // Get game statistics
    getGameStats: (gameId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    g.*,
                    COUNT(up.id) as total_purchases,
                    AVG(gr.rating) as avg_rating,
                    COUNT(gr.id) as review_count
                FROM games g
                LEFT JOIN user_purchases up ON g.id = up.game_id
                LEFT JOIN game_reviews gr ON g.id = gr.game_id
                WHERE g.id = ?
                GROUP BY g.id
            `;
            db.get(query, [gameId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

// Purchase queries
const purchaseQueries = {
    // Create purchase
    createPurchase: (purchaseData) => {
        return new Promise((resolve, reject) => {
            const { user_id, game_id, purchase_price, payment_method, transaction_id } = purchaseData;
            db.run(`INSERT INTO user_purchases (user_id, game_id, purchase_price, payment_method, transaction_id) 
                    VALUES (?, ?, ?, ?, ?)`, 
                [user_id, game_id, purchase_price, payment_method, transaction_id], 
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...purchaseData });
                });
        });
    },

    // Get user purchases
    getUserPurchases: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT up.*, g.title, g.images, g.download_url
                FROM user_purchases up
                JOIN games g ON up.game_id = g.id
                WHERE up.user_id = ?
                ORDER BY up.purchase_date DESC
            `;
            db.all(query, [userId], (err, rows) => {
                if (err) reject(err);
                else {
                    const purchases = rows.map(purchase => ({
                        ...purchase,
                        images: JSON.parse(purchase.images || '[]')
                    }));
                    resolve(purchases);
                }
            });
        });
    },

    // Check if user owns game
    userOwnsGame: (userId, gameId) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT id FROM user_purchases WHERE user_id = ? AND game_id = ?`, 
                [userId, gameId], (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                });
        });
    },

    // Update download count
    updateDownloadCount: (userId, gameId) => {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE user_purchases SET download_count = download_count + 1, 
                    last_download = CURRENT_TIMESTAMP WHERE user_id = ? AND game_id = ?`, 
                [userId, gameId], function(err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                });
        });
    }
};

// Wishlist queries
const wishlistQueries = {
    // Add to wishlist
    addToWishlist: (userId, gameId) => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT OR IGNORE INTO user_wishlist (user_id, game_id) VALUES (?, ?)`, 
                [userId, gameId], function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                });
        });
    },

    // Remove from wishlist
    removeFromWishlist: (userId, gameId) => {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM user_wishlist WHERE user_id = ? AND game_id = ?`, 
                [userId, gameId], function(err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                });
        });
    },

    // Get user wishlist
    getUserWishlist: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT w.*, g.title, g.price, g.images, g.user_rating
                FROM user_wishlist w
                JOIN games g ON w.game_id = g.id
                WHERE w.user_id = ? AND g.is_active = 1
                ORDER BY w.added_date DESC
            `;
            db.all(query, [userId], (err, rows) => {
                if (err) reject(err);
                else {
                    const wishlist = rows.map(item => ({
                        ...item,
                        images: JSON.parse(item.images || '[]')
                    }));
                    resolve(wishlist);
                }
            });
        });
    }
};

// Review queries
const reviewQueries = {
    // Create review
    createReview: (reviewData) => {
        return new Promise((resolve, reject) => {
            const { user_id, game_id, rating, review_text, playtime_hours, is_recommended } = reviewData;
            db.run(`INSERT OR REPLACE INTO game_reviews 
                    (user_id, game_id, rating, review_text, playtime_hours, is_recommended) 
                    VALUES (?, ?, ?, ?, ?, ?)`, 
                [user_id, game_id, rating, review_text, playtime_hours, is_recommended], 
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...reviewData });
                });
        });
    },

    // Get game reviews
    getGameReviews: (gameId, limit = 10, offset = 0) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT gr.*, u.username, u.avatar_url
                FROM game_reviews gr
                JOIN users u ON gr.user_id = u.id
                WHERE gr.game_id = ?
                ORDER BY gr.created_at DESC
                LIMIT ? OFFSET ?
            `;
            db.all(query, [gameId, limit, offset], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

// Activity logging
const activityQueries = {
    // Log user activity
    logActivity: (userId, activityType, activityData, ipAddress, userAgent) => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO user_activity 
                    (user_id, activity_type, activity_data, ip_address, user_agent) 
                    VALUES (?, ?, ?, ?, ?)`, 
                [userId, activityType, JSON.stringify(activityData), ipAddress, userAgent], 
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                });
        });
    },

    // Get user activity
    getUserActivity: (userId, limit = 50) => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM user_activity WHERE user_id = ? 
                    ORDER BY created_at DESC LIMIT ?`, 
                [userId, limit], (err, rows) => {
                    if (err) reject(err);
                    else {
                        const activities = rows.map(activity => ({
                            ...activity,
                            activity_data: JSON.parse(activity.activity_data || '{}')
                        }));
                        resolve(activities);
                    }
                });
        });
    }
};

module.exports = {
    userQueries,
    gameQueries,
    purchaseQueries,
    wishlistQueries,
    reviewQueries,
    activityQueries
};