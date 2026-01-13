const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'gameshop.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                date_of_birth DATE,
                country TEXT,
                preferred_language TEXT DEFAULT 'en',
                avatar_url TEXT,
                bio TEXT,
                is_email_verified BOOLEAN DEFAULT 0,
                email_verification_token TEXT,
                password_reset_token TEXT,
                password_reset_expires DATETIME,
                account_status TEXT DEFAULT 'active',
                privacy_settings TEXT DEFAULT '{}',
                notification_preferences TEXT DEFAULT '{}',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_login DATETIME,
                login_count INTEGER DEFAULT 0
            )`);

            // Games table
            db.run(`CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                short_description TEXT,
                price DECIMAL(10,2) NOT NULL,
                original_price DECIMAL(10,2),
                discount_percentage INTEGER DEFAULT 0,
                category TEXT NOT NULL,
                genre TEXT,
                developer TEXT,
                publisher TEXT,
                release_date DATE,
                age_rating TEXT,
                platform TEXT DEFAULT 'PC',
                languages TEXT, -- JSON array of supported languages
                features TEXT, -- JSON array of game features
                tags TEXT, -- JSON array of tags
                images TEXT, -- JSON array of image URLs
                videos TEXT, -- JSON array of video URLs
                screenshots TEXT, -- JSON array of screenshot URLs
                system_requirements TEXT, -- JSON object with min/recommended specs
                download_size_mb INTEGER,
                download_url TEXT,
                is_featured BOOLEAN DEFAULT 0,
                is_active BOOLEAN DEFAULT 1,
                is_early_access BOOLEAN DEFAULT 0,
                metacritic_score INTEGER,
                user_rating DECIMAL(3,2) DEFAULT 0,
                total_reviews INTEGER DEFAULT 0,
                total_sales INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // User purchases table
            db.run(`CREATE TABLE IF NOT EXISTS user_purchases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                game_id INTEGER NOT NULL,
                purchase_price DECIMAL(10,2) NOT NULL,
                purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                payment_method TEXT,
                transaction_id TEXT,
                order_status TEXT DEFAULT 'completed',
                download_count INTEGER DEFAULT 0,
                last_download DATETIME,
                refund_requested BOOLEAN DEFAULT 0,
                refund_date DATETIME,
                refund_reason TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (game_id) REFERENCES games (id),
                UNIQUE(user_id, game_id)
            )`);

            // User wishlist table
            db.run(`CREATE TABLE IF NOT EXISTS user_wishlist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                game_id INTEGER NOT NULL,
                added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (game_id) REFERENCES games (id),
                UNIQUE(user_id, game_id)
            )`);

            // Game reviews table
            db.run(`CREATE TABLE IF NOT EXISTS game_reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                game_id INTEGER NOT NULL,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                review_text TEXT,
                playtime_hours INTEGER DEFAULT 0,
                is_recommended BOOLEAN DEFAULT 1,
                helpful_votes INTEGER DEFAULT 0,
                total_votes INTEGER DEFAULT 0,
                is_verified_purchase BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (game_id) REFERENCES games (id),
                UNIQUE(user_id, game_id)
            )`);

            // User sessions table (for login tracking)
            db.run(`CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_token TEXT UNIQUE NOT NULL,
                ip_address TEXT,
                user_agent TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`);

            // User activity log table
            db.run(`CREATE TABLE IF NOT EXISTS user_activity (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                activity_type TEXT NOT NULL,
                activity_data TEXT, -- JSON data
                ip_address TEXT,
                user_agent TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`);

            // Game categories table
            db.run(`CREATE TABLE IF NOT EXISTS game_categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT,
                icon TEXT,
                color TEXT,
                is_active BOOLEAN DEFAULT 1,
                sort_order INTEGER DEFAULT 0
            )`);

            // Create indexes for better performance
            db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_games_category ON games(category)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_games_featured ON games(is_featured)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_games_active ON games(is_active)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_purchases_user ON user_purchases(user_id)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_purchases_game ON user_purchases(game_id)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_wishlist_user ON user_wishlist(user_id)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_reviews_game ON game_reviews(game_id)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id)`);

            console.log('✅ Database tables created successfully');
            resolve();
        });
    });
}

// Seed initial data
async function seedDatabase() {
    return new Promise((resolve, reject) => {
        // Insert default categories
        const categories = [
            { name: 'RPG', description: 'Role Playing Games', icon: 'fas fa-dragon', color: '#8b5cf6' },
            { name: 'Action', description: 'Action Games', icon: 'fas fa-fist-raised', color: '#ef4444' },
            { name: 'Adventure', description: 'Adventure Games', icon: 'fas fa-compass', color: '#06b6d4' },
            { name: 'Strategy', description: 'Strategy Games', icon: 'fas fa-chess', color: '#10b981' },
            { name: 'Racing', description: 'Racing Games', icon: 'fas fa-car', color: '#f59e0b' },
            { name: 'Puzzle', description: 'Puzzle Games', icon: 'fas fa-puzzle-piece', color: '#6366f1' },
            { name: 'Indie', description: 'Independent Games', icon: 'fas fa-heart', color: '#ec4899' },
            { name: 'Sports', description: 'Sports Games', icon: 'fas fa-football-ball', color: '#84cc16' },
            { name: 'Simulation', description: 'Simulation Games', icon: 'fas fa-cogs', color: '#64748b' }
        ];

        db.serialize(() => {
            const stmt = db.prepare(`INSERT OR IGNORE INTO game_categories (name, description, icon, color) VALUES (?, ?, ?, ?)`);
            categories.forEach(cat => {
                stmt.run(cat.name, cat.description, cat.icon, cat.color);
            });
            stmt.finalize();

            // Insert sample games
            const games = [
                {
                    title: "Cyber Nexus 2077",
                    description: "Immerse yourself in a dystopian cyberpunk world where technology and humanity collide. Make choices that shape the future of Neo-Tokyo in this epic RPG adventure.",
                    short_description: "Cyberpunk RPG adventure in Neo-Tokyo",
                    price: 59.99,
                    category: "RPG",
                    genre: "Cyberpunk RPG",
                    developer: "NeoTech Studios",
                    publisher: "GameHub Interactive",
                    release_date: "2024-03-15",
                    age_rating: "M",
                    languages: JSON.stringify(["English", "Japanese", "Spanish", "French"]),
                    features: JSON.stringify(["Single Player", "Achievements", "Cloud Save", "Controller Support"]),
                    tags: JSON.stringify(["Cyberpunk", "Open World", "Story Rich", "Futuristic"]),
                    images: JSON.stringify(["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop"]),
                    system_requirements: JSON.stringify({
                        minimum: {
                            os: "Windows 10 64-bit",
                            processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
                            memory: "8 GB RAM",
                            graphics: "NVIDIA GTX 1060 / AMD RX 580",
                            storage: "50 GB available space"
                        },
                        recommended: {
                            os: "Windows 11 64-bit",
                            processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
                            memory: "16 GB RAM",
                            graphics: "NVIDIA RTX 3070 / AMD RX 6700 XT",
                            storage: "50 GB SSD space"
                        }
                    }),
                    download_size_mb: 45000,
                    is_featured: 1,
                    user_rating: 4.8,
                    total_reviews: 1250,
                    metacritic_score: 89
                },
                {
                    title: "Mystic Realms: Chronicles",
                    description: "Embark on an epic fantasy journey through magical realms filled with ancient mysteries, powerful spells, and legendary creatures waiting to be discovered.",
                    short_description: "Epic fantasy adventure with magic and mysteries",
                    price: 49.99,
                    category: "Adventure",
                    genre: "Fantasy Adventure",
                    developer: "Mystic Games",
                    publisher: "GameHub Interactive",
                    release_date: "2024-02-20",
                    age_rating: "T",
                    languages: JSON.stringify(["English", "German", "Italian", "Portuguese"]),
                    features: JSON.stringify(["Single Player", "Co-op", "Achievements", "Trading Cards"]),
                    tags: JSON.stringify(["Fantasy", "Magic", "Adventure", "Exploration"]),
                    images: JSON.stringify(["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"]),
                    system_requirements: JSON.stringify({
                        minimum: {
                            os: "Windows 10 64-bit",
                            processor: "Intel Core i3-8100 / AMD Ryzen 3 2200G",
                            memory: "6 GB RAM",
                            graphics: "NVIDIA GTX 1050 / AMD RX 560",
                            storage: "35 GB available space"
                        }
                    }),
                    download_size_mb: 32000,
                    is_featured: 1,
                    user_rating: 4.6,
                    total_reviews: 890,
                    metacritic_score: 85
                },
                {
                    title: "Stellar Command",
                    description: "Build and command your space fleet in this strategic masterpiece. Explore galaxies, manage resources, and engage in tactical battles across the cosmos.",
                    short_description: "Strategic space fleet command game",
                    price: 39.99,
                    category: "Strategy",
                    genre: "Space Strategy",
                    developer: "Cosmic Studios",
                    publisher: "GameHub Interactive",
                    release_date: "2024-01-10",
                    age_rating: "E10+",
                    languages: JSON.stringify(["English", "Russian", "Chinese", "Korean"]),
                    features: JSON.stringify(["Single Player", "Multiplayer", "Workshop", "Mod Support"]),
                    tags: JSON.stringify(["Space", "Strategy", "Management", "Tactical"]),
                    images: JSON.stringify(["https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop"]),
                    system_requirements: JSON.stringify({
                        minimum: {
                            os: "Windows 10 64-bit",
                            processor: "Intel Core i3-7100 / AMD Ryzen 3 1200",
                            memory: "4 GB RAM",
                            graphics: "NVIDIA GTX 950 / AMD RX 460",
                            storage: "25 GB available space"
                        }
                    }),
                    download_size_mb: 22000,
                    is_featured: 1,
                    user_rating: 4.4,
                    total_reviews: 650,
                    metacritic_score: 82
                }
            ];

            const gameStmt = db.prepare(`INSERT OR IGNORE INTO games (
                title, description, short_description, price, category, genre, developer, publisher,
                release_date, age_rating, languages, features, tags, images, system_requirements,
                download_size_mb, is_featured, user_rating, total_reviews, metacritic_score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

            games.forEach(game => {
                gameStmt.run(
                    game.title, game.description, game.short_description, game.price,
                    game.category, game.genre, game.developer, game.publisher,
                    game.release_date, game.age_rating, game.languages, game.features,
                    game.tags, game.images, game.system_requirements, game.download_size_mb,
                    game.is_featured, game.user_rating, game.total_reviews, game.metacritic_score
                );
            });
            gameStmt.finalize();

            console.log('✅ Database seeded with initial data');
            resolve();
        });
    });
}

// Create admin user
async function createAdminUser() {
    return new Promise((resolve, reject) => {
        const adminPassword = 'admin123'; // Change this in production!
        const hashedPassword = bcrypt.hashSync(adminPassword, 10);

        db.run(`INSERT OR IGNORE INTO users (
            username, email, password_hash, first_name, last_name, 
            account_status, is_email_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        ['admin', 'admin@gamehub.com', hashedPassword, 'Admin', 'User', 'admin', 1], 
        function(err) {
            if (err) {
                console.error('Error creating admin user:', err);
                reject(err);
            } else {
                console.log('✅ Admin user created (username: admin, password: admin123)');
                resolve();
            }
        });
    });
}

// Export database instance and functions
module.exports = {
    db,
    initializeDatabase,
    seedDatabase,
    createAdminUser
};