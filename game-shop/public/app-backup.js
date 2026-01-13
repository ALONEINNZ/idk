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
    
    // Update navigation
    updateUserNavigation();
    updateWishlistDisplay();
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
            tags: ['graphics', 'textures', 'lighting', '4k']
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
            tags: ['combat', 'gameplay', 'mechanics', 'free']
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
            tags: ['ui', 'interface', 'cyberpunk', 'neon']
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
                        <button onclick="event.stopPropagation(); ${mod.isFree ? `downloadMod('${mod._id}')` : `addModToCart('${mod._id}')`}" class="btn btn-primary btn-full">
                            <i class="fas fa-${mod.isFree ? 'download' : 'cart-plus'}"></i>
                            ${mod.isFree ? 'Download Free' : 'Add to Cart'}
                        </button>
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
    
    showMessage(`Viewing ${mod.title}`, 'info');
}

function addModToCart(modId) {
    if (!currentUser) {
        showLogin();
        showMessage('Please login to add mods to cart', 'error');
        return;
    }
    
    const mod = mods.find(m => m._id === modId);
    if (mod && !cart.find(item => item._id === modId)) {
        cart.push(mod);
        updateCartDisplay();
        saveData();
        showMessage(`${mod.title} added to cart!`, 'success');
    }
}

function downloadMod(modId) {
    if (!currentUser) {
        showLogin();
        showMessage('Please login to download mods', 'error');
        return;
    }
    
    const mod = mods.find(m => m._id === modId);
    if (mod) {
        showMessage(`Downloading ${mod.title}...`, 'success');
    }
}

// Cart Management
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function toggleCart() {
    const cart = document.getElementById('cart');
    if (cart) {
        cart.classList.toggle('open');
    }
}

// Wishlist Management
function updateWishlistDisplay() {
    // Wishlist functionality
}

function toggleWishlist() {
    const wishlist = document.getElementById('wishlist');
    if (wishlist) {
        wishlist.classList.toggle('open');
    }
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
    document.getElementById('authModal').style.display = 'none';
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

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
    if (chatbot) {
        chatbot.classList.toggle('open');
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

console.log('ExusCraft app loaded successfully!');