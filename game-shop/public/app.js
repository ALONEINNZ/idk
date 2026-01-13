// Global variables
let currentUser = null;
let games = [];
let mods = [];
let cart = [];
let wishlist = [];
let stripe = null;
let selectedGame = null;
let currentTheme = 'dark';

// API base URL
const API_BASE = window.location.origin + '/api';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Initialize theme
    initializeTheme();
    
    // Hide loading screen
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // Load saved data
    loadSavedData();
    
    // Initialize Stripe
    if (window.Stripe) {
        stripe = Stripe('pk_test_your_stripe_publishable_key_here');
    }
    
    // Check for existing auth token
    const token = localStorage.getItem('token');
    if (token) {
        fetchCurrentUser();
    }
    
    // Load mods
    loadModsForExusCraft();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Update navigation and displays
    updateUserNavigation();
    updateWishlistDisplay();
    updateCartDisplay();
    
    // Test functions are available
    console.log('Functions available:', {
        addModToCart: typeof window.addModToCart,
        addToWishlist: typeof window.addToWishlist,
        toggleCart: typeof window.toggleCart,
        toggleWishlist: typeof window.toggleWishlist
    });
});

// Theme System
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    showMessage(`Switched to ${currentTheme} theme`, 'success');
}

function updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Data Management
function loadSavedData() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function saveData() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Authentication
async function fetchCurrentUser() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            updateUserNavigation();
        } else {
            localStorage.removeItem('token');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
    }
}

function updateUserNavigation() {
    const navUser = document.getElementById('navUser');
    const navAuth = document.getElementById('navAuth');
    const username = document.getElementById('username');
    const userAvatar = document.getElementById('userAvatar');
    
    if (currentUser) {
        navUser.style.display = 'flex';
        navAuth.style.display = 'none';
        username.textContent = currentUser.username || currentUser.name || 'User';
        
        if (userAvatar) {
            if (currentUser.avatar || currentUser.picture) {
                userAvatar.src = currentUser.avatar || currentUser.picture;
            } else {
                const firstLetter = (currentUser.username || currentUser.name || 'U')[0].toUpperCase();
                userAvatar.src = `https://via.placeholder.com/32x32/ff6b6b/ffffff?text=${firstLetter}`;
            }
        }
    } else {
        navUser.style.display = 'none';
        navAuth.style.display = 'flex';
    }
}

function showLogin() {
    document.getElementById('authContent').innerHTML = `
        <div class="auth-form">
            <div class="auth-header">
                <h2>Welcome Back</h2>
                <p>Sign in to your ExusCraft account</p>
            </div>
            
            <button onclick="loginWithGoogle()" class="google-login-btn">
                <svg viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>
            
            <div class="form-divider">
                <span>or</span>
            </div>
            
            <form onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="loginEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn btn-primary btn-full btn-large">Sign In</button>
            </form>
            
            <div class="auth-footer">
                Don't have an account? <a href="#" onclick="showRegister()">Join ExusCraft</a>
            </div>
        </div>
    `;
    document.getElementById('authModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('authContent').innerHTML = `
        <div class="auth-form">
            <div class="auth-header">
                <h2>Join ExusCraft</h2>
                <p>Create your account to access premium mods</p>
            </div>
            
            <button onclick="loginWithGoogle()" class="google-login-btn">
                <svg viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>
            
            <div class="form-divider">
                <span>or</span>
            </div>
            
            <form onsubmit="handleRegister(event)">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="registerUsername" placeholder="Choose a username" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="registerEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="registerPassword" placeholder="Create a password" required minlength="6">
                </div>
                <button type="submit" class="btn btn-primary btn-full btn-large">Create Account</button>
            </form>
            
            <div class="auth-footer">
                Already have an account? <a href="#" onclick="showLogin()">Sign In</a>
            </div>
        </div>
    `;
    document.getElementById('authModal').style.display = 'block';
}

async function handleLogin(event) {
    event.preventDefault();
    
    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUserNavigation();
            closeAuthModal();
            showMessage('Welcome back to ExusCraft!', 'success');
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    try {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUserNavigation();
            closeAuthModal();
            showMessage('Welcome to ExusCraft!', 'success');
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Registration failed. Please try again.', 'error');
    }
}

async function loginWithGoogle() {
    showMessage('Google login integration coming soon!', 'info');
    
    // Demo Google login
    setTimeout(() => {
        currentUser = {
            id: 'google_' + Date.now(),
            username: 'Google User',
            email: 'user@gmail.com',
            avatar: 'https://via.placeholder.com/32x32/4285f4/ffffff?text=G',
            provider: 'google'
        };
        updateUserNavigation();
        closeAuthModal();
        showMessage('Successfully signed in with Google!', 'success');
    }, 1000);
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    cart = [];
    updateUserNavigation();
    updateCartDisplay();
    showMessage('Thanks for visiting ExusCraft!', 'success');
}

// User Interface
function toggleUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    const userAvatar = document.querySelector('.user-avatar');
    
    if (userDropdown && userAvatar) {
        userDropdown.classList.toggle('show');
        userAvatar.classList.toggle('open');
        
        // Close dropdown when clicking outside
        if (userDropdown.classList.contains('show')) {
            setTimeout(() => {
                document.addEventListener('click', function closeUserDropdown(e) {
                    if (!e.target.closest('.user-profile-dropdown')) {
                        userDropdown.classList.remove('show');
                        userAvatar.classList.remove('open');
                        document.removeEventListener('click', closeUserDropdown);
                    }
                });
            }, 100);
        }
    }
}

function showProfile() {
    showMessage('Profile feature coming soon!', 'info');
}

function showOrders() {
    showMessage('Orders feature coming soon!', 'info');
}

function showSettings() {
    showMessage('Settings feature coming soon!', 'info');
}

// Mods Loading
async function loadModsForExusCraft() {
    try {
        console.log('Loading mods...');
        
        const response = await fetch(`${API_BASE}/mods?limit=50`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        mods = data.mods || [];
        
        if (mods.length === 0) {
            await createSampleMods();
        } else {
            displayModsInSections(mods);
        }
        
    } catch (error) {
        console.error('Error loading mods:', error);
        await createSampleMods();
    }
}

async function createSampleMods() {
    mods = [
        {
            _id: 'cs2plugin',
            title: 'CS2 Style Competitive Plugin',
            description: 'Transform your Rust server into a CS2-style competitive experience! Features 5v5 matchmaking, bomb plant/defuse, buy menus, economy system, ranking, tournaments, weapon skins, achievements and more.',
            shortDescription: 'Complete CS2-style competitive gameplay for Rust',
            price: 24.99,
            isFree: false,
            category: 'Gameplay',
            gameTitle: 'Rust',
            author: 'BugFixed',
            images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop'],
            version: '2.1.0',
            rating: 4.9,
            downloads: 45230,
            featured: true,
            status: 'in-progress',
            tags: ['competitive', 'cs2', 'matchmaking', '5v5', 'in-development', 'beta']
        },
        {
            _id: 'mod1',
            title: 'Ultra Graphics Overhaul',
            description: 'Complete visual transformation with 4K textures and enhanced lighting.',
            shortDescription: 'Transform your game with stunning 4K visuals',
            price: 15.99,
            isFree: false,
            category: 'Graphics',
            gameTitle: 'Skyrim',
            author: 'VisualMaster',
            images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop'],
            version: '2.1.0',
            rating: 4.8,
            downloads: 15420,
            featured: true,
            status: 'finalised',
            tags: ['graphics', 'textures', 'lighting', '4k', 'finalised', 'bug-tested']
        },
        {
            _id: 'mod2',
            title: 'Realistic Combat System',
            description: 'Overhauls combat mechanics with new animations and weapon physics.',
            shortDescription: 'Revolutionary combat mechanics overhaul',
            price: 0,
            isFree: true,
            category: 'Gameplay',
            gameTitle: 'Minecraft',
            author: 'CombatPro',
            images: ['https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop'],
            version: '1.5.2',
            rating: 4.6,
            downloads: 8930,
            featured: true,
            status: 'bug-tested',
            tags: ['combat', 'gameplay', 'mechanics', 'free', 'bug-tested']
        },
        {
            _id: 'mod3',
            title: 'Cyberpunk UI Redesign',
            description: 'Futuristic interface overhaul with neon aesthetics and smooth animations.',
            shortDescription: 'Futuristic UI with cyberpunk aesthetics',
            price: 8.99,
            isFree: false,
            category: 'UI/UX',
            gameTitle: 'Cyberpunk 2077',
            author: 'NeonDesigner',
            images: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'],
            version: '1.0.3',
            rating: 4.7,
            downloads: 12100,
            featured: true,
            status: 'beta',
            tags: ['ui', 'interface', 'cyberpunk', 'neon', 'beta']
        },
        {
            _id: 'mod4',
            title: 'New Survival Mechanics',
            description: 'Early stage survival mod with hunger, thirst and temperature systems.',
            shortDescription: 'New survival mechanics - early development',
            price: 0,
            isFree: true,
            category: 'Gameplay',
            gameTitle: 'Rust',
            author: 'SurvivalDev',
            images: ['https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop'],
            version: '0.1.0',
            rating: 3.5,
            downloads: 1250,
            featured: false,
            status: 'starting-out',
            tags: ['survival', 'gameplay', 'starting-out', 'in-development']
        }
    ];
    
    displayModsInSections(mods);
}

function displayModsInSections(modsToShow) {
    const featuredMods = modsToShow.filter(mod => mod.featured).slice(0, 3);
    displayPremiumMods(featuredMods, 'featuredGames');
    
    const newMods = modsToShow.slice(0, 6);
    displayPremiumMods(newMods, 'newReleases');
    
    const freeMods = modsToShow.filter(mod => mod.isFree).slice(0, 6);
    displayPremiumMods(freeMods, 'dealsGames');
    
    displayAllMods(modsToShow, 'allGames');
}

function displayPremiumMods(modsToShow, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = modsToShow.map((mod, index) => {
        const stars = '★'.repeat(Math.floor(mod.rating || 4)) + '☆'.repeat(5 - Math.floor(mod.rating || 4));
        const priceDisplay = mod.isFree ? 'FREE' : `$${mod.price.toFixed(2)}`;
        
        return `
            <div class="game-card" onclick="showModDetails('${mod._id}')">
                ${mod.featured ? '<div class="featured-badge">Featured</div>' : ''}
                ${mod.isFree ? '<div class="featured-badge" style="background: var(--accent-gold);">FREE</div>' : ''}
                
                <div class="game-image">
                    <img src="${mod.images[0]}" alt="${mod.title}" loading="lazy">
                </div>
                
                <div class="game-info">
                    <h3 class="game-title">${mod.title}</h3>
                    <p class="game-description">${mod.shortDescription || mod.description}</p>
                    
                    <div class="game-meta">
                        <div class="game-price">${priceDisplay}</div>
                        <div class="game-category">${mod.category}</div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div class="game-rating">
                            <span style="color: #fbbf24; font-size: 1rem;">${stars}</span>
                            <span style="color: var(--text-secondary); font-weight: 500; margin-left: 0.5rem;">${(mod.rating || 4.0).toFixed(1)}</span>
                        </div>
                        <div style="color: var(--text-muted); font-size: 0.9rem;">
                            <i class="fas fa-download"></i> ${mod.downloads || 0}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <div style="color: var(--text-secondary); font-size: 0.9rem;">
                            <i class="fas fa-gamepad"></i> ${mod.gameTitle}
                        </div>
                        <div style="color: var(--text-muted); font-size: 0.8rem;">
                            by ${mod.author} • v${mod.version}
                        </div>
                    </div>
                    
                    <div class="game-actions">
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <button onclick="event.stopPropagation(); addToWishlist('${mod._id}')" class="wishlist-btn" title="Add to Wishlist">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button onclick="event.stopPropagation(); ${mod.isFree ? `downloadMod('${mod._id}')` : `addModToCart('${mod._id}')`}" class="btn btn-primary" style="flex: 1;">
                                <i class="fas fa-${mod.isFree ? 'download' : 'cart-plus'}"></i>
                                ${mod.isFree ? 'Download Free' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function displayAllMods(modsToShow, containerId) {
    displayPremiumMods(modsToShow, containerId);
}

function showModDetails(modId) {
    const mod = mods.find(m => m._id === modId);
    if (!mod) return;
    
    const modal = document.getElementById('gameModal');
    const gameDetails = document.getElementById('gameDetails');
    
    if (!modal || !gameDetails) return;
    
    const stars = '★'.repeat(Math.floor(mod.rating || 4)) + '☆'.repeat(5 - Math.floor(mod.rating || 4));
    const priceDisplay = mod.isFree ? 'FREE' : `$${mod.price.toFixed(2)}`;
    
    // Status badge config
    const statusConfig = {
        'in-progress': { color: '#f59e0b', label: 'In Progress', icon: '🔧' },
        'in-development': { color: '#f59e0b', label: 'In Development', icon: '🔧' },
        'finalised': { color: '#10b981', label: 'Finalised', icon: '✅' },
        'bug-tested': { color: '#3b82f6', label: 'Bug Tested', icon: '🐛' },
        'beta': { color: '#8b5cf6', label: 'Beta', icon: '🧪' },
        'starting-out': { color: '#ef4444', label: 'Starting Out', icon: '🌱' }
    };
    const status = statusConfig[mod.status] || null;
    
    gameDetails.innerHTML = `
        <div class="mod-detail">
            <div class="mod-detail-header">
                <img src="${mod.images[0]}" alt="${mod.title}" class="mod-detail-image">
                <div class="mod-detail-info">
                    <h2 class="mod-detail-title">${mod.title}</h2>
                    ${status ? `<span style="display: inline-flex; align-items: center; gap: 0.3rem; background: ${status.color}; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem;"><span>${status.icon}</span> ${status.label}</span>` : ''}
                    <div class="mod-detail-meta">
                        <span class="mod-detail-game"><i class="fas fa-gamepad"></i> ${mod.gameTitle}</span>
                        <span class="mod-detail-category"><i class="fas fa-tag"></i> ${mod.category}</span>
                        <span class="mod-detail-version"><i class="fas fa-code-branch"></i> v${mod.version}</span>
                    </div>
                    <div class="mod-detail-author">
                        <i class="fas fa-user"></i> by <strong>${mod.author}</strong>
                    </div>
                    <div class="mod-detail-rating">
                        <span style="color: #fbbf24; font-size: 1.2rem;">${stars}</span>
                        <span style="margin-left: 0.5rem;">${(mod.rating || 4.0).toFixed(1)} / 5.0</span>
                        <span style="color: var(--text-muted); margin-left: 1rem;"><i class="fas fa-download"></i> ${(mod.downloads || 0).toLocaleString()} downloads</span>
                    </div>
                </div>
            </div>
            
            <div class="mod-detail-description">
                <h3>Description</h3>
                <p>${mod.description}</p>
            </div>
            
            ${mod.tags && mod.tags.length > 0 ? `
            <div class="mod-detail-tags">
                <h3>Tags</h3>
                <div class="tags-list">
                    ${mod.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="mod-detail-price">
                <span class="price-label">${mod.isFree ? 'Free Download' : 'Price:'}</span>
                <span class="price-value" style="font-size: 2rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${priceDisplay}</span>
            </div>
            
            <div class="mod-detail-actions">
                ${mod.isFree ? `
                    <button onclick="downloadMod('${mod._id}'); closeModal();" class="btn btn-primary btn-large" style="flex: 1;">
                        <i class="fas fa-download"></i> Download Now
                    </button>
                ` : `
                    <button onclick="addModToCart('${mod._id}'); closeModal();" class="btn btn-primary btn-large" style="flex: 1;">
                        <i class="fas fa-cart-plus"></i> Add to Cart - ${priceDisplay}
                    </button>
                `}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function addModToCart(modId) {
    console.log('addModToCart called with:', modId);
    
    // Create demo user if not logged in for testing
    if (!currentUser) {
        currentUser = {
            id: 'demo_user',
            username: 'Demo User',
            email: 'demo@example.com'
        };
        updateUserNavigation();
        showMessage('Demo mode activated for testing!', 'info');
    }
    
    const mod = mods.find(m => m._id === modId);
    if (mod && !cart.find(item => item._id === modId)) {
        cart.push(mod);
        updateCartDisplay();
        saveData();
        showMessage(`${mod.title} added to cart!`, 'success');
        console.log('Cart updated:', cart);
    } else if (cart.find(item => item._id === modId)) {
        showMessage(`${mod ? mod.title : 'Item'} is already in cart!`, 'info');
    } else {
        showMessage('Mod not found!', 'error');
    }
}

function downloadMod(modId) {
    console.log('downloadMod called with:', modId);
    
    // Create demo user if not logged in for testing
    if (!currentUser) {
        currentUser = {
            id: 'demo_user',
            username: 'Demo User',
            email: 'demo@example.com'
        };
        updateUserNavigation();
        showMessage('Demo mode activated for testing!', 'info');
    }
    
    const mod = mods.find(m => m._id === modId);
    if (mod) {
        showMessage(`Preparing download for ${mod.title}...`, 'info');
        
        // If mod has a real download URL, open it
        if (mod.downloadUrl && mod.downloadUrl.startsWith('http')) {
            setTimeout(() => {
                window.open(mod.downloadUrl, '_blank');
                showMessage(`Opening download page for ${mod.title}!`, 'success');
            }, 1000);
        } else {
            // Simulate download for demo mods
            setTimeout(() => {
                showMessage(`${mod.title} downloaded successfully!`, 'success');
            }, 2000);
        }
    }
}

// Cart Management
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>Your cart is empty</p>
                    <p style="font-size: 0.9rem;">Add some amazing mods to get started!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.images[0]}" alt="${item.title}">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <button onclick="removeFromCart('${item._id}')" class="cart-item-remove" title="Remove from cart">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

function toggleCart() {
    const cartElement = document.getElementById('cart');
    console.log('toggleCart called, element:', cartElement);
    
    if (cartElement) {
        cartElement.classList.toggle('open');
        
        if (cartElement.classList.contains('open')) {
            updateCartDisplay();
            console.log('Cart opened');
        } else {
            console.log('Cart closed');
        }
    }
}

function removeFromCart(modId) {
    cart = cart.filter(item => item._id !== modId);
    updateCartDisplay();
    saveData();
    showMessage('Item removed from cart', 'info');
}

// Wishlist Management
function updateWishlistDisplay() {
    const wishlistItems = document.getElementById('wishlistItems');
    const wishlistCount = document.getElementById('wishlistCount');
    
    // Update wishlist count in navigation
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
    
    if (wishlistItems) {
        if (wishlist.length === 0) {
            wishlistItems.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <i class="fas fa-heart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>Your wishlist is empty</p>
                    <p style="font-size: 0.9rem;">Add mods you love to keep track of them!</p>
                </div>
            `;
        } else {
            wishlistItems.innerHTML = wishlist.map(item => `
                <div class="wishlist-item">
                    <img src="${item.images[0]}" alt="${item.title}">
                    <div class="wishlist-item-info">
                        <h4>${item.title}</h4>
                        <p>${item.isFree ? 'FREE' : '$' + item.price.toFixed(2)}</p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button onclick="addModToCart('${item._id}')" class="btn btn-primary">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                        <button onclick="removeFromWishlist('${item._id}')" title="Remove from wishlist">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function toggleWishlist() {
    const wishlistElement = document.getElementById('wishlist');
    console.log('toggleWishlist called, element:', wishlistElement);
    
    if (wishlistElement) {
        const isOpen = wishlistElement.classList.contains('open');
        
        if (isOpen) {
            wishlistElement.classList.remove('open');
            console.log('Wishlist closed');
        } else {
            wishlistElement.classList.add('open');
            updateWishlistDisplay();
            console.log('Wishlist opened');
        }
    }
}

function addToWishlist(modId) {
    console.log('addToWishlist called with:', modId);
    
    // Create demo user if not logged in for testing
    if (!currentUser) {
        currentUser = {
            id: 'demo_user',
            username: 'Demo User',
            email: 'demo@example.com'
        };
        updateUserNavigation();
        showMessage('Demo mode activated for testing!', 'info');
    }
    
    const mod = mods.find(m => m._id === modId);
    if (mod && !wishlist.find(item => item._id === modId)) {
        wishlist.push(mod);
        updateWishlistDisplay();
        saveData();
        showMessage(`${mod.title} added to wishlist!`, 'success');
        console.log('Wishlist updated:', wishlist);
    } else if (wishlist.find(item => item._id === modId)) {
        showMessage(`${mod ? mod.title : 'Item'} is already in wishlist!`, 'info');
    } else {
        showMessage('Mod not found!', 'error');
    }
}

function removeFromWishlist(modId) {
    wishlist = wishlist.filter(item => item._id !== modId);
    updateWishlistDisplay();
    saveData();
    showMessage('Item removed from wishlist', 'info');
}

// Utility Functions
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        padding: 1.5rem 2rem;
        border-radius: var(--border-radius);
        color: white;
        font-weight: 600;
        z-index: 3000;
        max-width: 400px;
        box-shadow: var(--shadow-heavy);
        animation: slideInMessage 0.5s ease;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeModal() {
    const modal = document.getElementById('gameModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const modals = ['authModal', 'profileModal', 'gameModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in, .game-card').forEach(el => {
        observer.observe(el);
    });
}

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Chatbot
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const notification = document.getElementById('chatNotification');
    
    if (chatbot) {
        chatbot.classList.toggle('open');
        
        if (chatbot.classList.contains('open')) {
            console.log('Chatbot opened');
            // Hide notification when opening chatbot
            if (notification) {
                notification.style.display = 'none';
            }
        } else {
            console.log('Chatbot closed');
        }
    }
}

// Make functions globally available
window.toggleTheme = toggleTheme;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.loginWithGoogle = loginWithGoogle;
window.logout = logout;
window.toggleUserMenu = toggleUserMenu;
window.showProfile = showProfile;
window.showOrders = showOrders;
window.showSettings = showSettings;
window.toggleCart = toggleCart;
window.toggleWishlist = toggleWishlist;
window.toggleChatbot = toggleChatbot;
window.closeAuthModal = closeAuthModal;
window.closeProfileModal = closeProfileModal;

// Missing functions that are called from HTML
window.checkLoginAndNavigate = function(section) {
    if (!currentUser) {
        showLogin();
        showMessage('Please login to access this section', 'info');
        return;
    }
    // Navigate to section logic here
    showMessage(`Navigating to ${section}...`, 'info');
};

window.checkLoginAndExplore = function() {
    const modsSection = document.getElementById('games');
    if (modsSection) {
        modsSection.scrollIntoView({ behavior: 'smooth' });
    }
};

window.toggleGameDropdown = function() {
    const dropdown = document.getElementById('gameDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
        
        // Close dropdown when clicking outside
        if (dropdown.classList.contains('show')) {
            setTimeout(() => {
                document.addEventListener('click', function closeDropdown(e) {
                    if (!e.target.closest('.nav-dropdown')) {
                        dropdown.classList.remove('show');
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }, 100);
        }
    }
};

window.filterByGame = function(game) {
    showMessage(`Filtering mods for ${game}...`, 'info');
    // Filter logic would go here
};

window.filterByGameAdvanced = function() {
    const gameFilter = document.getElementById('gameFilter');
    if (gameFilter && gameFilter.value) {
        filterByGame(gameFilter.value);
    }
};

window.searchAllMods = function() {
    const searchInput = document.getElementById('gameSearch');
    if (searchInput && searchInput.value) {
        showMessage(`Searching for: ${searchInput.value}`, 'info');
    }
};

window.filterAllMods = function() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter && categoryFilter.value) {
        showMessage(`Filtering by category: ${categoryFilter.value}`, 'info');
    }
};

window.sortMods = function() {
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter && sortFilter.value) {
        showMessage(`Sorting by: ${sortFilter.value}`, 'info');
    }
};

window.loadMoreMods = function() {
    showMessage('Loading more mods...', 'info');
};

window.closeModal = function() {
    const modal = document.getElementById('gameModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

window.checkout = function() {
    if (!currentUser) {
        showLogin();
        showMessage('Please login to checkout', 'error');
        return;
    }
    showMessage('Checkout feature coming soon!', 'info');
};

window.addAllWishlistToCart = function() {
    if (!currentUser) {
        showLogin();
        showMessage('Please login to add items to cart', 'error');
        return;
    }
    showMessage('Adding wishlist items to cart...', 'info');
};

window.removeFromCart = function(modId) {
    removeFromCart(modId);
};

window.addToWishlist = function(modId) {
    addToWishlist(modId);
};

window.removeFromWishlist = function(modId) {
    removeFromWishlist(modId);
};

window.handleChatKeyPress = function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
};

window.sendMessage = function() {
    const input = document.getElementById('chatInput');
    if (input && input.value.trim()) {
        const message = input.value.trim();
        input.value = '';
        
        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate bot response with delay
        setTimeout(() => {
            hideTypingIndicator();
            const response = getBotResponse(message);
            addMessageToChat(response, 'bot');
        }, 1500);
    }
};

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

window.askBot = function(question) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = question;
        sendMessage();
    }
};

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    // Format message with basic markdown-like styling
    let formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
        .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
        .replace(/\n/g, '<br>'); // Line breaks
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
        </div>
        <div class="message-content">
            <div>${formattedMessage}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced chatbot responses with interactive elements
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm ExusBot, your gaming & tech assistant! 🤖 How can I help you today? I can assist with mod installation, programming questions, tech support, and much more! 😊";
    }
    
    if (lowerMessage.includes('mod') && lowerMessage.includes('install')) {
        return `To install mods safely:
        
1. 📁 Download the mod file from a trusted source
2. 📂 Extract to your game's mod folder (usually in Documents or game directory)
3. ⚙️ Enable the mod in your game's mod manager or settings
4. 🔄 Restart the game to load the mod
5. ✅ Test the mod to ensure it works properly

💡 Pro tip: Always backup your save files before installing new mods! Need help with a specific game's mod installation?`;
    }
    
    if (lowerMessage.includes('javascript') || lowerMessage.includes('programming') || lowerMessage.includes('code')) {
        return `I can help with programming! 💻 Here are some areas I excel at:

• JavaScript (ES6+, Node.js, React, Vue)
• Python (Django, Flask, data science)
• Web development (HTML, CSS, APIs)
• Database queries (SQL, MongoDB)
• Debugging and optimization
• Code reviews and best practices

What specific programming challenge are you working on? Share your code and I'll help you solve it! 🚀`;
    }
    
    if (lowerMessage.includes('compatibility') || lowerMessage.includes('tech support')) {
        return `For compatibility issues, try these steps: 🔧

1. ✅ Check system requirements vs your specs
2. 🔄 Update graphics drivers (NVIDIA/AMD)
3. 🛠️ Verify game files through Steam/launcher
4. 📋 Check mod compatibility with game version
5. 🧹 Clear temporary files and cache
6. 🔍 Check for conflicting software

Still having issues? Tell me your specific problem, game, and system specs - I'll provide targeted solutions! 🎯`;
    }
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('optimization') || lowerMessage.includes('fps') || lowerMessage.includes('lag')) {
        return `Performance optimization tips: ⚡

🎮 **Game Settings:**
• Lower graphics quality (shadows, textures)
• Disable V-Sync if causing input lag
• Reduce render distance/view distance

💻 **System Optimization:**
• Close background applications
• Update graphics drivers
• Check available RAM and storage
• Monitor CPU/GPU temperatures

🔧 **Advanced Tips:**
• Adjust Windows power settings to High Performance
• Disable Windows Game Mode if causing issues
• Consider overclocking (if experienced)

What's your current FPS and target? I can provide specific optimization recommendations! 📊`;
    }
    
    if (lowerMessage.includes('news') || lowerMessage.includes('latest') || lowerMessage.includes('update')) {
        return `I can help with gaming and tech news! 📰 Here's what I can cover:

🎮 **Gaming News:**
• New game releases and updates
• Patch notes and balance changes
• Gaming industry trends
• Hardware reviews and benchmarks

💻 **Tech Updates:**
• Software updates and features
• Hardware launches (GPUs, CPUs)
• Programming language updates
• Development tools and frameworks

What specific gaming or tech news are you interested in? I'll provide the latest information! 🔥`;
    }
    
    if (lowerMessage.includes('what can you') || lowerMessage.includes('help me') || lowerMessage.includes('features')) {
        return `I'm your comprehensive gaming & tech assistant! Here's what I can help with: 🌟

🎮 **Gaming Support:**
• Mod installation and troubleshooting
• Game optimization and performance
• Hardware compatibility checks
• Gaming setup recommendations

💻 **Programming & Development:**
• Code debugging and optimization
• Web development (HTML, CSS, JS)
• Backend development (Node.js, Python)
• Database design and queries

🔧 **Technical Support:**
• System troubleshooting
• Software installation help
• Network and connectivity issues
• Hardware diagnostics

📚 **Learning & Education:**
• Programming tutorials
• Technology explanations
• Best practices and tips
• Career guidance in tech

Just ask me anything - I'm here to help! What would you like to explore first? 🚀`;
    }
    
    // Math calculations
    if (lowerMessage.includes('calculate') || lowerMessage.includes('math') || /\d+[\+\-\*\/]\d+/.test(lowerMessage)) {
        // Simple math evaluation (basic security check)
        const mathMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
        if (mathMatch) {
            const [, num1, operator, num2] = mathMatch;
            const a = parseFloat(num1);
            const b = parseFloat(num2);
            let result;
            
            switch (operator) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = b !== 0 ? a / b : 'Cannot divide by zero'; break;
                default: result = 'Invalid operation';
            }
            
            return `🧮 **Calculation Result:**\n${a} ${operator} ${b} = **${result}**\n\nNeed help with more complex math? I can assist with algebra, geometry, statistics, and more! 📊`;
        }
        
        return "I can help with calculations and math problems! 🧮 Try asking me to calculate something like '15 + 27' or 'square root of 144'. I can also help with algebra, geometry, and statistics!";
    }
    
    // Creative writing
    if (lowerMessage.includes('write') || lowerMessage.includes('story') || lowerMessage.includes('creative')) {
        return `I'd love to help with creative writing! ✍️ Here's what I can assist with:

📖 **Story Development:**
• Plot structure and pacing
• Character development and dialogue
• World-building and settings
• Genre-specific techniques

🎭 **Writing Techniques:**
• Narrative voice and perspective
• Show vs. tell principles
• Conflict and tension building
• Editing and revision strategies

💡 **Creative Inspiration:**
• Writing prompts and ideas
• Overcoming writer's block
• Research and fact-checking
• Publishing and sharing tips

What kind of writing project are you working on? Share your ideas and I'll help bring them to life! 🌟`;
    }
    
    // Science questions
    if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology')) {
        return `I love science questions! 🔬 I can explain concepts in:

⚛️ **Physics:**
• Mechanics, thermodynamics, electromagnetism
• Quantum physics and relativity
• Optics and wave phenomena

🧪 **Chemistry:**
• Atomic structure and bonding
• Chemical reactions and equations
• Organic and inorganic chemistry

🧬 **Biology:**
• Cell biology and genetics
• Evolution and ecology
• Human anatomy and physiology

🌍 **Earth Science:**
• Geology and meteorology
• Climate and environmental science
• Astronomy and space science

What scientific concept would you like to explore? I'll explain it in an easy-to-understand way! 🌟`;
    }
    
    // Gaming specific questions
    if (lowerMessage.includes('minecraft') || lowerMessage.includes('skyrim') || lowerMessage.includes('cyberpunk') || lowerMessage.includes('gta')) {
        const game = lowerMessage.includes('minecraft') ? 'Minecraft' :
                    lowerMessage.includes('skyrim') ? 'Skyrim' :
                    lowerMessage.includes('cyberpunk') ? 'Cyberpunk 2077' :
                    lowerMessage.includes('gta') ? 'GTA V' : 'that game';
                    
        return `Great choice! ${game} is an amazing game! 🎮 I can help you with:

• Mod recommendations and installation
• Performance optimization tips
• Troubleshooting common issues
• Best gameplay strategies
• Hardware requirements

What specific help do you need with ${game}? Whether it's technical issues, mod suggestions, or gameplay tips, I'm here to help! 🚀`;
    }
    
    // Default response with suggestions
    return `That's an interesting question! 🤔 I'm here to help with gaming, tech, programming, and many other topics. 

Here are some things you could ask me:
• "Help me install Skyrim mods"
• "Debug my JavaScript code"
• "Optimize my game performance"
• "Explain quantum physics"
• "Calculate 25 * 4"
• "Latest gaming news"

Could you provide more details about what you'd like to know? I'm ready to help! 😊`;
}

console.log('ExusCraft app loaded successfully!');
// Ensure all cart and wishlist functions are globally available
window.addModToCart = function(modId) {
    addModToCart(modId);
};

window.downloadMod = function(modId) {
    downloadMod(modId);
};