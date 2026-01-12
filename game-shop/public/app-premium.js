// Global variables
let currentUser = null;
let games = [];
let cart = [];
let stripe = null;

// API base URL
const API_BASE = window.location.origin + '/api';

// Initialize app with premium loading experience
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1500);

    // Initialize Stripe
    if (window.Stripe) {
        stripe = Stripe('pk_test_your_stripe_publishable_key_here');
    }
    
    // Check for existing auth token
    const token = localStorage.getItem('token');
    if (token) {
        fetchCurrentUser();
    }
    
    // Load games
    loadPremiumGames();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
});

// Premium smooth scrolling
function initSmoothScrolling() {
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all animation elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .game-card, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// Load premium games with staggered animations
async function loadPremiumGames() {
    try {
        // Fetch all games from server
        const response = await fetch(`${API_BASE}/games?limit=50`);
        const data = await response.json();
        games = data.games || [];
        
        // Load featured games
        const featuredGames = games.filter(game => game.featured);
        displayPremiumGames(featuredGames, 'featuredGames');
        
        // Load new releases (first 6 games)
        const newReleases = games.slice(0, 6);
        displayPremiumGames(newReleases, 'newReleases');
        
        // Load deals (games with discount simulation)
        const dealsGames = games.slice(6, 12).map(game => ({
            ...game,
            originalPrice: game.price + 20,
            discount: 25
        }));
        displayPremiumGames(dealsGames, 'dealsGames');
    } catch (error) {
        console.error('Error loading games:', error);
        showMessage('Failed to load games', 'error');
    }
}

// Display games with premium styling
function displayPremiumGames(gamesToShow, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = gamesToShow.map((game, index) => {
        const stars = '★'.repeat(Math.floor(game.rating || 4)) + '☆'.repeat(5 - Math.floor(game.rating || 4));
        
        return `
            <div class="game-card" style="animation-delay: ${index * 0.2}s" onclick="showGameDetails('${game._id}')">
                ${game.featured ? '<div class="featured-badge">Featured</div>' : ''}
                ${game.discount ? `<div class="featured-badge" style="background: var(--accent-gold);">${game.discount}% OFF</div>` : ''}
                
                <div class="game-image">
                    <img src="${game.images[0]}" alt="${game.title}" loading="lazy">
                </div>
                
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    
                    <div class="game-meta">
                        <div class="game-price">
                            ${game.originalPrice ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 1rem; margin-right: 0.5rem;">$${game.originalPrice.toFixed(2)}</span>` : ''}
                            $${game.price.toFixed(2)}
                        </div>
                        <div class="game-category">${game.category}</div>
                    </div>
                    
                    <div class="game-rating" style="margin-bottom: 1rem;">
                        <span style="color: #fbbf24; font-size: 1rem;">${stars}</span>
                        <span style="color: var(--text-secondary); font-weight: 500; margin-left: 0.5rem;">${(game.rating || 4.0).toFixed(1)}</span>
                    </div>
                    
                    <div class="game-actions">
                        <button onclick="event.stopPropagation(); addToCart('${game._id}')" class="btn btn-primary btn-full">
                            <i class="fas fa-cart-plus"></i>
                            Add to Collection
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Re-observe new elements for animations
    setTimeout(() => {
        container.querySelectorAll('.game-card').forEach((card, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Add bobbing animation for featured games section
                        if (containerId === 'featuredGames') {
                            entry.target.classList.add('featured-bob');
                            entry.target.style.setProperty('--bob-delay', `${index * 0.8}s`);
                        }
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(card);
        });
    }, 100);
}

// Premium game details modal
async function showGameDetails(gameId) {
    try {
        const game = games.find(g => g._id === gameId);
        if (!game) {
            showMessage('Game not found', 'error');
            return;
        }
        
        const stars = '★'.repeat(Math.floor(game.rating || 4)) + '☆'.repeat(5 - Math.floor(game.rating || 4));
        
        document.getElementById('gameDetails').innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 3rem;">
                <div>
                    <img src="${game.images[0]}" alt="${game.title}" 
                         style="width: 100%; height: 400px; object-fit: cover; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-medium);">
                </div>
                <div>
                    <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${game.title}</h2>
                    
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                        <span class="game-category">${game.category}</span>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: #fbbf24; font-size: 1.2rem;">${stars}</span>
                            <span style="font-weight: 600; color: var(--text-secondary);">${(game.rating || 4.0).toFixed(1)}/5</span>
                        </div>
                    </div>
                    
                    <div style="font-size: 3rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 2rem;">
                        $${game.price.toFixed(2)}
                    </div>
                    
                    ${game.tags ? `
                        <div style="margin-bottom: 2rem;">
                            <h4 style="margin-bottom: 1rem; color: var(--text-primary);">Tags:</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${game.tags.map(tag => `<span style="background: rgba(99, 102, 241, 0.2); color: var(--accent-primary); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${tag}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <button onclick="addToCart('${game._id}')" class="btn btn-primary btn-large" style="width: 100%;">
                        <i class="fas fa-cart-plus"></i>
                        Add to Collection - $${game.price.toFixed(2)}
                    </button>
                </div>
            </div>
            
            <div style="margin-bottom: 3rem;">
                <h3 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-primary);">About This Game</h3>
                <p style="line-height: 1.8; color: var(--text-secondary); font-size: 1.1rem;">${game.description}</p>
            </div>
        `;
        
        document.getElementById('gameModal').style.display = 'block';
    } catch (error) {
        showMessage('Failed to load game details', 'error');
    }
}

// Premium cart functionality
function addToCart(gameId) {
    if (!currentUser) {
        showLogin();
        showMessage('Please login to add games to your collection', 'error');
        return;
    }
    
    const game = games.find(g => g._id === gameId);
    if (game && !cart.find(item => item._id === gameId)) {
        cart.push(game);
        updateCartDisplay();
        showMessage(`${game.title} added to your collection!`, 'success');
        
        // Add premium animation to cart button
        const cartToggle = document.getElementById('cartToggle');
        cartToggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartToggle.style.transform = 'scale(1)';
        }, 200);
    } else if (cart.find(item => item._id === gameId)) {
        showMessage('Game already in your collection!', 'error');
    }
}

function removeFromCart(gameId) {
    cart = cart.filter(game => game._id !== gameId);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Your collection is empty</h3>
                <p>Discover amazing games to start building your library!</p>
            </div>
        `;
        cartTotal.textContent = '0.00';
        return;
    }
    
    const total = cart.reduce((sum, game) => sum + game.price, 0);
    cartTotal.textContent = total.toFixed(2);
    
    cartItems.innerHTML = cart.map(game => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <div>
                <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">${game.title}</h4>
                <p style="color: var(--accent-primary); font-weight: 700; font-size: 1.1rem;">$${game.price.toFixed(2)}</p>
                <small style="color: var(--text-muted);">${game.category}</small>
            </div>
            <button onclick="removeFromCart('${game._id}')" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function toggleCart() {
    const cart = document.getElementById('cart');
    cart.classList.toggle('open');
}

// Premium checkout
async function checkout() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    if (cart.length === 0) {
        showMessage('Your collection is empty', 'error');
        return;
    }
    
    const total = cart.reduce((sum, game) => sum + game.price, 0);
    const confirmed = confirm(`Complete your purchase of $${total.toFixed(2)}?`);
    
    if (confirmed) {
        // Simulate successful purchase
        cart = [];
        updateCartDisplay();
        toggleCart();
        showMessage('Purchase successful! Welcome to your new gaming adventures!', 'success');
    }
}

// Auth functions
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
            updateNavigation();
        } else {
            localStorage.removeItem('token');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
    }
}

function updateNavigation() {
    const navUser = document.getElementById('navUser');
    const navAuth = document.getElementById('navAuth');
    const username = document.getElementById('username');
    
    if (currentUser) {
        navUser.style.display = 'flex';
        navAuth.style.display = 'none';
        username.textContent = currentUser.username;
    } else {
        navUser.style.display = 'none';
        navAuth.style.display = 'flex';
    }
}

function showLogin() {
    document.getElementById('authContent').innerHTML = `
        <div style="max-width: 400px; margin: 0 auto;">
            <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem; font-weight: 800; color: var(--text-primary);">Welcome Back</h2>
            <form onsubmit="handleLogin(event)">
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">Email</label>
                    <input type="email" id="loginEmail" placeholder="Enter your email" required 
                           style="width: 100%; padding: 1rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--border-radius); background: var(--bg-secondary); color: var(--text-primary); font-size: 1rem;">
                </div>
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">Password</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password" required 
                           style="width: 100%; padding: 1rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--border-radius); background: var(--bg-secondary); color: var(--text-primary); font-size: 1rem;">
                </div>
                <button type="submit" class="btn btn-primary btn-full btn-large">Sign In</button>
            </form>
            <p style="text-align: center; margin-top: 2rem; color: var(--text-secondary);">
                Don't have an account? <a href="#" onclick="showRegister()" style="color: var(--accent-primary); text-decoration: none;">Join GameHub</a>
            </p>
        </div>
    `;
    document.getElementById('authModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('authContent').innerHTML = `
        <div style="max-width: 400px; margin: 0 auto;">
            <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem; font-weight: 800; color: var(--text-primary);">Join GameHub</h2>
            <form onsubmit="handleRegister(event)">
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">Username</label>
                    <input type="text" id="registerUsername" placeholder="Choose a username" required 
                           style="width: 100%; padding: 1rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--border-radius); background: var(--bg-secondary); color: var(--text-primary); font-size: 1rem;">
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">Email</label>
                    <input type="email" id="registerEmail" placeholder="Enter your email" required 
                           style="width: 100%; padding: 1rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--border-radius); background: var(--bg-secondary); color: var(--text-primary); font-size: 1rem;">
                </div>
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">Password</label>
                    <input type="password" id="registerPassword" placeholder="Create a password" required minlength="6" 
                           style="width: 100%; padding: 1rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--border-radius); background: var(--bg-secondary); color: var(--text-primary); font-size: 1rem;">
                    <small style="color: var(--text-muted); font-size: 0.8rem; margin-top: 0.5rem; display: block;">Password must be at least 6 characters long</small>
                </div>
                <button type="submit" class="btn btn-primary btn-full btn-large">Create Account</button>
            </form>
            <p style="text-align: center; margin-top: 2rem; color: var(--text-secondary);">
                Already have an account? <a href="#" onclick="showLogin()" style="color: var(--accent-primary); text-decoration: none;">Sign In</a>
            </p>
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
            updateNavigation();
            closeAuthModal();
            showMessage(data.message || 'Welcome back to GameHub!', 'success');
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
            updateNavigation();
            closeAuthModal();
            showMessage(data.message || 'Welcome to GameHub! Your gaming journey begins now.', 'success');
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Registration failed. Please try again.', 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    cart = [];
    updateNavigation();
    updateCartDisplay();
    showMessage('Thanks for visiting GameHub!', 'success');
}

// Modal functions
function closeModal() {
    document.getElementById('gameModal').style.display = 'none';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// Premium message system
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        padding: 1.5rem 2rem;
        border-radius: var(--border-radius);
        color: var(--text-primary);
        font-weight: 600;
        z-index: 3000;
        max-width: 400px;
        box-shadow: var(--shadow-heavy);
        backdrop-filter: blur(10px);
        animation: slideInMessage 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
        border: 1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
    `;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutMessage 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => messageDiv.remove(), 500);
    }, 4000);
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInMessage {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutMessage {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Close modals when clicking outside
window.onclick = function(event) {
    const gameModal = document.getElementById('gameModal');
    const authModal = document.getElementById('authModal');
    
    if (event.target === gameModal) {
        gameModal.style.display = 'none';
    }
    if (event.target === authModal) {
        authModal.style.display = 'none';
    }
}