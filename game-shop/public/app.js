// Global variables
let currentUser = null;
let games = []; // Keep for backward compatibility
let mods = []; // New mods array
let cart = [];
let stripe = null;
let selectedGame = null; // Currently selected game filter

// API base URL
const API_BASE = window.location.origin + '/api';

// Initialize app with premium loading experience
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Hide loading screen immediately
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
        console.log('Loading screen hidden immediately');
    }
    
    // Performance optimizations
    // Throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(function() {
            scrollTimeout = null;
            // Handle scroll events here if needed
        }, 16); // ~60fps
    }, { passive: true });
    
    // Optimize animations with requestAnimationFrame
    window.requestIdleCallback = window.requestIdleCallback || function(cb) {
        return setTimeout(cb, 1);
    };
    
    // Test if JavaScript is working
    console.log('JavaScript is working!');
    
    // Make functions globally available for debugging
    window.testFunction = function() {
        alert('JavaScript is working!');
    };

    // Initialize Stripe
    if (window.Stripe) {
        stripe = Stripe('pk_test_your_stripe_publishable_key_here');
    }
    
    // Check for existing auth token
    const token = localStorage.getItem('token');
    if (token) {
        fetchCurrentUser();
    }
    
    // Check for URL parameters (e.g., from email links)
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'login' && !currentUser) {
        // User came from email link, show login modal
        setTimeout(() => {
            showLogin();
            showMessage('Welcome back! Please login to continue shopping.', 'success');
        }, 2000); // Wait for loading screen to finish
    }
    
    // Handle routing based on current path
    handleRouting();
    
    // Load games
    console.log('About to load premium games...');
    loadPremiumGames();
    
    // Load mods for ExusCraft
    console.log('Loading mods for ExusCraft...');
    loadModsForExusCraft();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Update navigation active states
    updateNavigation();
    
    // Debug: Add global function to check games
    window.debugGames = function() {
        console.log('Total games loaded:', games.length);
        console.log('Games array:', games);
        console.log('Featured games containers:', document.querySelectorAll('#featuredGames .game-card').length);
        console.log('New releases containers:', document.querySelectorAll('#newReleases .game-card').length);
        console.log('Deals containers:', document.querySelectorAll('#dealsGames .game-card').length);
        console.log('All games containers:', document.querySelectorAll('#allGames .game-card').length);
    };
});

// Handle routing based on current path
function handleRouting() {
    const path = window.location.pathname;
    console.log('Current path:', path);
    
    // Update navigation active states
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });
    
    // Show/hide sections based on route
    switch(path) {
        case '/':
        case '/games':
            showGamesPage();
            break;
        case '/new-releases':
            showNewReleasesPage();
            break;
        case '/deals':
            showDealsPage();
            break;
        case '/genres':
            showGenresPage();
            break;
        case '/about':
            showAboutPage();
            break;
        default:
            showGamesPage();
    }
}

// Show different page content
function showGamesPage() {
    // Show all sections for games page
    showSection('hero');
    showSection('games');
    showSection('new-releases');
    showSection('deals');
    document.querySelector('.parallax-section').style.display = 'block';
}

function showNewReleasesPage() {
    // Hide hero, show only new releases
    hideSection('hero');
    hideSection('games');
    showSection('new-releases');
    hideSection('deals');
    document.querySelector('.parallax-section').style.display = 'none';
    
    // Scroll to new releases section
    setTimeout(() => {
        const section = document.getElementById('new-releases');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

function showDealsPage() {
    // Hide hero, show only deals
    hideSection('hero');
    hideSection('games');
    hideSection('new-releases');
    showSection('deals');
    document.querySelector('.parallax-section').style.display = 'none';
    
    // Scroll to deals section
    setTimeout(() => {
        const section = document.getElementById('deals');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

function showGenresPage() {
    // Show all games section with focus on categories
    hideSection('hero');
    hideSection('games');
    hideSection('new-releases');
    hideSection('deals');
    showSection('games'); // Show all games section
    document.querySelector('.parallax-section').style.display = 'none';
    
    // Focus on the category filter
    setTimeout(() => {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.focus();
        }
    }, 100);
}

function showAboutPage() {
    // Hide all game sections, show hero with about content
    showSection('hero');
    hideSection('games');
    hideSection('new-releases');
    hideSection('deals');
    document.querySelector('.parallax-section').style.display = 'block';
    
    // Update hero content for about page
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    if (heroTitle) heroTitle.textContent = 'About ExusCraft';
    if (heroSubtitle) heroSubtitle.textContent = 'Your premium destination for digital gaming experiences. Discover, collect, and enjoy the finest games from around the world.';
    if (heroCta) heroCta.innerHTML = '<a href="/games" class="btn btn-primary btn-large">Browse Games</a>';
}

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'none';
    }
}

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

// Check login and navigate to section
function checkLoginAndNavigate(section) {
    if (!currentUser) {
        // User not logged in, show login modal
        showLogin();
        showMessage('Please login to access this section', 'error');
    } else {
        // User is logged in, navigate to section
        switch(section) {
            case 'mods':
            case 'games':
                scrollToSection('games');
                break;
            case 'free-mods':
                scrollToSection('deals');
                break;
            case 'new-releases':
                scrollToSection('new-releases');
                break;
            case 'deals':
                scrollToSection('deals');
                break;
            default:
                scrollToSection('featured-games');
        }
    }
}

// Check login and explore games
function checkLoginAndExplore() {
    if (!currentUser) {
        // User not logged in, show login modal
        showLogin();
        showMessage('Please login to explore our game collection', 'error');
    } else {
        // User is logged in, scroll to featured games
        scrollToSection('featured-games');
        showMessage(`Welcome back, ${currentUser.username}! Enjoy browsing our games.`, 'success');
    }
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
        console.log('Loading premium games...');
        console.log('API_BASE:', API_BASE);
        
        // Test the API URL first
        const testUrl = `${API_BASE}/games?limit=50&t=${Date.now()}`;
        console.log('Fetching from:', testUrl);
        
        // Fetch all games from server
        const response = await fetch(testUrl);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Games data:', data);
        games = data.games || [];
        console.log('Total games loaded:', games.length);
        
        if (games.length === 0) {
            console.warn('No games found');
            showMessage('No games available at the moment', 'error');
            return;
        }
        
        // Load featured games - ensure we always have some featured games
        let featuredGames = games.filter(game => game.featured);
        if (featuredGames.length === 0) {
            // If no games are marked as featured, use the first 3 games
            featuredGames = games.slice(0, 3).map(game => ({ ...game, featured: true }));
        }
        console.log('Featured games:', featuredGames.length);
        displayPremiumGames(featuredGames, 'featuredGames');
        
        // Ensure bobbing animation is applied to featured games (limit to 3 for performance)
        setTimeout(() => {
            const featuredContainer = document.getElementById('featuredGames');
            if (featuredContainer) {
                const cards = featuredContainer.querySelectorAll('.game-card');
                // Only animate first 3 cards for better performance
                cards.forEach((card, index) => {
                    if (index < 3) {
                        card.classList.add('featured-bob');
                        card.style.setProperty('--bob-delay', `${index * 1.2}s`);
                    }
                });
                console.log('Applied bobbing animation to', Math.min(cards.length, 3), 'featured games');
            }
        }, 500);
        
        // Load new releases (first 6 games)
        const newReleases = games.slice(0, 6);
        console.log('New releases:', newReleases.length);
        displayPremiumGames(newReleases, 'newReleases');
        
        // Load deals (games with discount simulation)
        const dealsGames = games.slice(6, 12).map(game => ({
            ...game,
            originalPrice: game.price + 20,
            discount: 25
        }));
        console.log('Deals games:', dealsGames.length);
        displayPremiumGames(dealsGames, 'dealsGames');
        
        // Load all games in the games section
        displayAllGames(games, 'allGames');
        
        console.log(`Displaying ${featuredGames.length} featured, ${newReleases.length} new, ${dealsGames.length} deals, ${games.length} total`);
        
    } catch (error) {
        console.error('Error loading games:', error);
        showMessage('Failed to load games: ' + error.message, 'error');
    }
}

// Display games with premium styling
function displayPremiumGames(gamesToShow, containerId) {
    console.log(`Displaying ${gamesToShow.length} games in container: ${containerId}`);
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }
    
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
    
    // Force visibility with inline styles
    setTimeout(() => {
        container.querySelectorAll('.game-card').forEach(card => {
            card.classList.add('visible');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0px)';
            card.style.visibility = 'visible';
            card.style.display = 'block';
        });
    }, 100);
    
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
                <p>Discover amazing mods to start building your collection!</p>
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
    // Check if user came from email link
    const urlParams = new URLSearchParams(window.location.search);
    const fromEmail = urlParams.get('action') === 'login';
    
    const title = fromEmail ? 'Welcome Back to ExusCraft!' : 'Welcome to ExusCraft';
    const subtitle = fromEmail ? 
        'Thanks for clicking the link in your email. Please login to continue shopping.' : 
        'Login to explore our premium game collection';
    
    document.getElementById('authContent').innerHTML = `
        <div style="max-width: 400px; margin: 0 auto;">
            <h2 style="text-align: center; margin-bottom: 1rem; font-size: 2rem; font-weight: 800; color: var(--text-primary);">${title}</h2>
            <p style="text-align: center; margin-bottom: 2rem; color: var(--text-secondary);">${subtitle}</p>
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
                <button type="submit" class="btn btn-primary btn-full btn-large">Sign In & Explore Games</button>
            </form>
            <p style="text-align: center; margin-top: 2rem; color: var(--text-secondary);">
                Don't have an account? <a href="#" onclick="showRegister()" style="color: var(--accent-primary); text-decoration: none;">Join ExusCraft</a>
            </p>
        </div>
    `;
    document.getElementById('authModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('authContent').innerHTML = `
        <div style="max-width: 400px; margin: 0 auto;">
            <h2 style="text-align: center; margin-bottom: 1rem; font-size: 2rem; font-weight: 800; color: var(--text-primary);">Join ExusCraft</h2>
            <p style="text-align: center; margin-bottom: 2rem; color: var(--text-secondary);">Create your account to access premium games</p>
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
                <button type="submit" class="btn btn-primary btn-full btn-large">Create Account & Start Gaming</button>
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
            updateUserNavigation();
            closeAuthModal();
            showMessage(data.message || 'Welcome back to ExusCraft!', 'success');
            
            // Clean up URL parameters
            const url = new URL(window.location);
            url.searchParams.delete('action');
            window.history.replaceState({}, document.title, url.pathname);
            
            // Auto-scroll to games after login
            setTimeout(() => {
                scrollToSection('featured-games');
            }, 1000);
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
            showMessage(data.message || 'Welcome to ExusCraft! Your modding journey begins now.', 'success');
            
            // Auto-scroll to games after registration
            setTimeout(() => {
                scrollToSection('featured-games');
            }, 1000);
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
    updateUserNavigation();
    updateCartDisplay();
    showMessage('Thanks for visiting ExusCraft!', 'success');
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

// All Games Section Variables
let filteredGames = [];
let displayedGamesCount = 0;
const gamesPerLoad = 8;

// Display all games with load more functionality
function displayAllGames(gamesToShow, containerId) {
    console.log(`Displaying all games in container: ${containerId}`);
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }
    
    filteredGames = [...gamesToShow];
    displayedGamesCount = 0;
    container.innerHTML = '';
    loadMoreGames();
}

// Load more games
function loadMoreGames() {
    const container = document.getElementById('allGames');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!container) return;
    
    const startIndex = displayedGamesCount;
    const endIndex = Math.min(startIndex + gamesPerLoad, filteredGames.length);
    const gamesToAdd = filteredGames.slice(startIndex, endIndex);
    
    gamesToAdd.forEach((game, index) => {
        const stars = '★'.repeat(Math.floor(game.rating || 4)) + '☆'.repeat(5 - Math.floor(game.rating || 4));
        
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card visible';
        gameCard.style.animationDelay = `${index * 0.1}s`;
        gameCard.onclick = () => showGameDetails(game._id);
        
        gameCard.innerHTML = `
            ${game.featured ? '<div class="featured-badge">Featured</div>' : ''}
            
            <div class="game-image">
                <img src="${game.images[0]}" alt="${game.title}" loading="lazy">
            </div>
            
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                
                <div class="game-meta">
                    <div class="game-price">$${game.price.toFixed(2)}</div>
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
        `;
        
        container.appendChild(gameCard);
    });
    
    displayedGamesCount = endIndex;
    
    // Show/hide load more button
    if (displayedGamesCount >= filteredGames.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }
}

// Search all games
function searchAllGames() {
    const searchTerm = document.getElementById('gameSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    filteredGames = games.filter(game => {
        const matchesSearch = !searchTerm || 
            game.title.toLowerCase().includes(searchTerm) ||
            game.description.toLowerCase().includes(searchTerm) ||
            (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        
        const matchesCategory = !category || game.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    // Reset and reload games
    displayedGamesCount = 0;
    document.getElementById('allGames').innerHTML = '';
    loadMoreGames();
}

// Search all mods
function searchAllMods() {
    const searchTerm = document.getElementById('gameSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    filteredGames = mods.filter(mod => {
        const matchesSearch = !searchTerm || 
            mod.title.toLowerCase().includes(searchTerm) ||
            mod.description.toLowerCase().includes(searchTerm) ||
            mod.shortDescription.toLowerCase().includes(searchTerm) ||
            mod.gameTitle.toLowerCase().includes(searchTerm) ||
            mod.author.toLowerCase().includes(searchTerm) ||
            (mod.tags && mod.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
        
        const matchesCategory = !category || mod.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    // Reset and reload mods
    displayedGamesCount = 0;
    document.getElementById('allGames').innerHTML = '';
    loadMoreMods();
}

// Filter all mods by category
function filterAllMods() {
    searchAllMods(); // Reuse search logic
}

// Filter all games by category
function filterAllGames() {
    searchAllGames(); // Reuse search logic
}

// Game Dropdown Functions for Navigation
function toggleGameDropdown() {
    const dropdown = document.getElementById('gameDropdown');
    dropdown.classList.toggle('show');
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!e.target.closest('.nav-dropdown')) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function filterByGame(gameTitle) {
    selectedGame = gameTitle;
    
    // Update dropdown button text
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    dropdownToggle.innerHTML = `${gameTitle} <i class="fas fa-chevron-down"></i>`;
    
    // Close dropdown
    document.getElementById('gameDropdown').classList.remove('show');
    
    // Filter mods by selected game
    if (mods.length > 0) {
        const filteredMods = mods.filter(mod => 
            mod.gameTitle.toLowerCase().includes(gameTitle.toLowerCase())
        );
        displayModsInSections(filteredMods);
        showMessage(`Showing mods for ${gameTitle}`, 'success');
    }
    
    // Scroll to mods section
    setTimeout(() => {
        scrollToSection('featured-games');
    }, 500);
}

function selectGame(gameTitle) {
    filterByGame(gameTitle);
}

// Load mods for ExusCraft
async function loadModsForExusCraft() {
    try {
        console.log('Loading mods from ExusCraft API...');
        
        const response = await fetch(`${API_BASE}/mods?limit=50&t=${Date.now()}`);
        console.log('Mods response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Mods data:', data);
        mods = data.mods || [];
        console.log('Total mods loaded:', mods.length);
        
        if (mods.length === 0) {
            console.warn('No mods found, creating sample mods');
            await createSampleMods();
            return;
        }
        
        // Display mods in sections
        displayModsInSections(mods);
        
    } catch (error) {
        console.error('Error loading mods:', error);
        console.log('Creating sample mods due to error');
        await createSampleMods();
    }
}

// Create sample mods if none exist
async function createSampleMods() {
    mods = [
        {
            _id: 'mod1',
            title: 'Ultra Graphics Overhaul',
            description: 'Complete visual transformation with 4K textures, enhanced lighting, and realistic weather effects.',
            shortDescription: 'Transform your game with stunning 4K visuals',
            price: 15.99,
            isFree: false,
            category: 'Graphics',
            gameTitle: 'Skyrim',
            gameEngine: 'Creation Engine',
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
            description: 'Overhauls combat mechanics with new animations, weapon physics, and tactical gameplay elements.',
            shortDescription: 'Revolutionary combat mechanics overhaul',
            price: 0,
            isFree: true,
            category: 'Gameplay',
            gameTitle: 'Minecraft',
            gameEngine: 'Custom',
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
            description: 'Futuristic interface overhaul with neon aesthetics, smooth animations, and improved usability.',
            shortDescription: 'Futuristic UI with cyberpunk aesthetics',
            price: 8.99,
            isFree: false,
            category: 'UI/UX',
            gameTitle: 'Cyberpunk 2077',
            gameEngine: 'REDengine',
            author: 'NeonDesigner',
            images: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'],
            version: '1.0.3',
            rating: 4.7,
            downloads: 12100,
            featured: true,
            tags: ['ui', 'interface', 'cyberpunk', 'neon']
        },
        {
            _id: 'mod4',
            title: 'Immersive Sound Pack',
            description: 'High-quality audio overhaul with 3D positional sound, realistic effects, and ambient soundscapes.',
            shortDescription: 'Professional audio enhancement pack',
            price: 12.50,
            isFree: false,
            category: 'Audio',
            gameTitle: 'Rust',
            gameEngine: 'Unity',
            author: 'AudioMaster',
            images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'],
            version: '3.2.1',
            rating: 4.9,
            downloads: 6780,
            featured: false,
            tags: ['audio', 'sound', '3d', 'immersive']
        },
        {
            _id: 'mod5',
            title: 'Epic Quest Expansion',
            description: 'Massive content expansion with 50+ hours of new quests, characters, and storylines.',
            shortDescription: '50+ hours of new adventures and quests',
            price: 24.99,
            isFree: false,
            category: 'Maps',
            gameTitle: 'The Witcher 3',
            gameEngine: 'REDengine',
            author: 'QuestCrafter',
            images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
            version: '1.8.0',
            rating: 4.5,
            downloads: 9340,
            featured: false,
            tags: ['quests', 'content', 'expansion', 'story']
        },
        {
            _id: 'mod6',
            title: 'Weapon Arsenal Pack',
            description: 'Collection of 100+ realistic weapons with custom animations, sounds, and balanced stats.',
            shortDescription: '100+ realistic weapons with custom animations',
            price: 0,
            isFree: true,
            category: 'Weapons',
            gameTitle: 'GTA V',
            gameEngine: 'Custom',
            author: 'WeaponSmith',
            images: ['https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop'],
            version: '2.0.5',
            rating: 4.4,
            downloads: 18750,
            featured: false,
            tags: ['weapons', 'arsenal', 'animations', 'free']
        }
    ];
    
    console.log('Sample mods created:', mods.length);
    displayModsInSections(mods);
}

// Display mods in different sections
function displayModsInSections(modsToShow) {
    // Featured mods
    const featuredMods = modsToShow.filter(mod => mod.featured).slice(0, 3);
    if (featuredMods.length === 0) {
        // If no featured mods, use first 3
        featuredMods.push(...modsToShow.slice(0, 3));
    }
    displayPremiumMods(featuredMods, 'featuredGames');
    
    // New releases (latest mods)
    const newMods = modsToShow.slice(0, 6);
    displayPremiumMods(newMods, 'newReleases');
    
    // Free mods for deals section
    const freeMods = modsToShow.filter(mod => mod.isFree).slice(0, 6);
    if (freeMods.length === 0) {
        // If no free mods, show some with discount simulation
        const discountMods = modsToShow.slice(3, 9).map(mod => ({
            ...mod,
            originalPrice: mod.price + 10,
            discount: 30,
            price: mod.price * 0.7
        }));
        displayPremiumMods(discountMods, 'dealsGames');
    } else {
        displayPremiumMods(freeMods, 'dealsGames');
    }
    
    // All mods
    displayAllMods(modsToShow, 'allGames');
}

// Display mods with premium styling (adapted from games)
function displayPremiumMods(modsToShow, containerId) {
    console.log(`Displaying ${modsToShow.length} mods in container: ${containerId}`);
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }
    
    container.innerHTML = modsToShow.map((mod, index) => {
        const stars = '★'.repeat(Math.floor(mod.rating || 4)) + '☆'.repeat(5 - Math.floor(mod.rating || 4));
        const priceDisplay = mod.isFree ? 'FREE' : `$${mod.price.toFixed(2)}`;
        
        return `
            <div class="game-card" style="animation-delay: ${index * 0.2}s" onclick="showModDetails('${mod._id}')">
                ${mod.featured ? '<div class="featured-badge">Featured</div>' : ''}
                ${mod.isFree ? '<div class="featured-badge" style="background: var(--accent-gold);">FREE</div>' : ''}
                ${mod.discount ? `<div class="featured-badge" style="background: var(--accent-gold);">${mod.discount}% OFF</div>` : ''}
                
                <div class="game-image">
                    <img src="${mod.images[0]}" alt="${mod.title}" loading="lazy">
                </div>
                
                <div class="game-info">
                    <h3 class="game-title">${mod.title}</h3>
                    <p class="game-description">${mod.shortDescription || mod.description}</p>
                    
                    <div class="game-meta">
                        <div class="game-price">
                            ${mod.originalPrice ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 1rem; margin-right: 0.5rem;">$${mod.originalPrice.toFixed(2)}</span>` : ''}
                            ${priceDisplay}
                        </div>
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
    
    // Force visibility with inline styles
    setTimeout(() => {
        container.querySelectorAll('.game-card').forEach(card => {
            card.classList.add('visible');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0px)';
            card.style.visibility = 'visible';
            card.style.display = 'block';
        });
    }, 100);
    
    // Add bobbing animation for featured mods
    if (containerId === 'featuredGames') {
        setTimeout(() => {
            container.querySelectorAll('.game-card').forEach((card, index) => {
                if (index < 3) {
                    card.classList.add('featured-bob');
                    card.style.setProperty('--bob-delay', `${index * 1.2}s`);
                }
            });
        }, 500);
    }
}

// Show mod details modal
async function showModDetails(modId) {
    try {
        const mod = mods.find(m => m._id === modId);
        if (!mod) {
            showMessage('Mod not found', 'error');
            return;
        }
        
        const stars = '★'.repeat(Math.floor(mod.rating || 4)) + '☆'.repeat(5 - Math.floor(mod.rating || 4));
        const priceDisplay = mod.isFree ? 'FREE' : `$${mod.price.toFixed(2)}`;
        
        document.getElementById('gameDetails').innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 3rem;">
                <div>
                    <img src="${mod.images[0]}" alt="${mod.title}" 
                         style="width: 100%; height: 400px; object-fit: cover; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-medium);">
                </div>
                <div>
                    <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${mod.title}</h2>
                    
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                        <span class="game-category">${mod.category}</span>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: #fbbf24; font-size: 1.2rem;">${stars}</span>
                            <span style="font-weight: 600; color: var(--text-secondary);">${(mod.rating || 4.0).toFixed(1)}/5</span>
                        </div>
                        <div style="color: var(--text-muted);">
                            <i class="fas fa-download"></i> ${mod.downloads || 0} downloads
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                            <i class="fas fa-gamepad"></i> <strong>Game:</strong> ${mod.gameTitle}
                        </div>
                        <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                            <i class="fas fa-cog"></i> <strong>Engine:</strong> ${mod.gameEngine}
                        </div>
                        <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                            <i class="fas fa-user"></i> <strong>Author:</strong> ${mod.author}
                        </div>
                        <div style="color: var(--text-secondary);">
                            <i class="fas fa-tag"></i> <strong>Version:</strong> ${mod.version}
                        </div>
                    </div>
                    
                    <div style="font-size: 3rem; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 2rem;">
                        ${priceDisplay}
                    </div>
                    
                    ${mod.tags ? `
                        <div style="margin-bottom: 2rem;">
                            <h4 style="margin-bottom: 1rem; color: var(--text-primary);">Tags:</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${mod.tags.map(tag => `<span style="background: rgba(99, 102, 241, 0.2); color: var(--accent-primary); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${tag}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <button onclick="${mod.isFree ? `downloadMod('${mod._id}')` : `addModToCart('${mod._id}')`}" class="btn btn-primary btn-large" style="width: 100%;">
                        <i class="fas fa-${mod.isFree ? 'download' : 'cart-plus'}"></i>
                        ${mod.isFree ? 'Download Free Mod' : `Add to Cart - ${priceDisplay}`}
                    </button>
                </div>
            </div>
            
            <div style="margin-bottom: 3rem;">
                <h3 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-primary);">About This Mod</h3>
                <p style="line-height: 1.8; color: var(--text-secondary); font-size: 1.1rem;">${mod.description}</p>
            </div>
        `;
        
        document.getElementById('gameModal').style.display = 'block';
    } catch (error) {
        showMessage('Failed to load mod details', 'error');
    }
}

// Add mod to cart
function addModToCart(modId) {
    if (!currentUser) {
        showLogin();
        showMessage('Please login to add mods to your cart', 'error');
        return;
    }
    
    const mod = mods.find(m => m._id === modId);
    if (mod && !cart.find(item => item._id === modId)) {
        cart.push(mod);
        updateCartDisplay();
        showMessage(`${mod.title} added to your cart!`, 'success');
        
        // Add premium animation to cart button
        const cartToggle = document.getElementById('cartToggle');
        cartToggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartToggle.style.transform = 'scale(1)';
        }, 200);
    } else if (cart.find(item => item._id === modId)) {
        showMessage('Mod already in your cart!', 'error');
    }
}

// Download free mod
async function downloadMod(modId) {
    if (!currentUser) {
        showLogin();
        showMessage('Please login to download mods', 'error');
        return;
    }
    
    try {
        const mod = mods.find(m => m._id === modId);
        if (!mod) {
            showMessage('Mod not found', 'error');
            return;
        }
        
        // Simulate download process
        showMessage(`Starting download of ${mod.title}...`, 'success');
        
        // In a real implementation, this would call the backend API
        // const response = await fetch(`${API_BASE}/mods/${modId}/download`, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${localStorage.getItem('token')}`
        //     }
        // });
        
        setTimeout(() => {
            showMessage(`${mod.title} download completed!`, 'success');
        }, 2000);
        
    } catch (error) {
        console.error('Download error:', error);
        showMessage('Download failed. Please try again.', 'error');
    }
}

// Display all mods with load more functionality
function displayAllMods(modsToShow, containerId) {
    console.log(`Displaying all mods in container: ${containerId}`);
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }
    
    // Use mods instead of games for filtering
    filteredGames = [...modsToShow]; // Keep the same variable name for compatibility
    displayedGamesCount = 0;
    container.innerHTML = '';
    loadMoreMods();
}

// Load more mods (adapted from loadMoreGames)
function loadMoreMods() {
    const container = document.getElementById('allGames');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!container) return;
    
    const startIndex = displayedGamesCount;
    const endIndex = Math.min(startIndex + gamesPerLoad, filteredGames.length);
    const modsToAdd = filteredGames.slice(startIndex, endIndex);
    
    modsToAdd.forEach((mod, index) => {
        const stars = '★'.repeat(Math.floor(mod.rating || 4)) + '☆'.repeat(5 - Math.floor(mod.rating || 4));
        const priceDisplay = mod.isFree ? 'FREE' : `$${mod.price.toFixed(2)}`;
        
        const modCard = document.createElement('div');
        modCard.className = 'game-card visible';
        modCard.style.animationDelay = `${index * 0.1}s`;
        modCard.onclick = () => showModDetails(mod._id);
        
        modCard.innerHTML = `
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
        `;
        
        container.appendChild(modCard);
    });
    
    displayedGamesCount = endIndex;
    
    // Show/hide load more button
    if (displayedGamesCount >= filteredGames.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }
}
// AI Chatbot Functionality
let chatbotOpen = false;
let chatHistory = [];

// Initialize chatbot
function initializeChatbot() {
    // Hide notification after first interaction
    setTimeout(() => {
        const notification = document.getElementById('chatNotification');
        if (notification) {
            notification.style.display = 'none';
        }
    }, 10000);
}

// Toggle chatbot visibility
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const notification = document.getElementById('chatNotification');
    
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbot.classList.add('open');
        if (notification) notification.style.display = 'none';
        
        // Focus on input when opened
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 300);
    } else {
        chatbot.classList.remove('open');
    }
}

// Handle chat input keypress
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send message function
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and respond
    setTimeout(async () => {
        hideTypingIndicator();
        await processMessage(message);
    }, 1000 + Math.random() * 1000); // Random delay for realism
}

// Quick ask function for suggestion buttons
function askBot(question) {
    const input = document.getElementById('chatInput');
    input.value = question;
    sendMessage();
}

// Add message to chat
function addMessage(content, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    if (sender === 'bot') {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in history
    chatHistory.push({ content, sender, timestamp: new Date() });
}

// Show typing indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="typing-indicator">
            <span>GameBot is typing</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Process user message and generate response
async function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = '';
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon')) {
        response = "Hello! 👋 Welcome to ExusCraft! I'm ExusBot, your gaming & tech assistant. I can help you with mods, games, programming, and technical questions. What would you like to know?";
    }
    // Mods and gaming
    else if (lowerMessage.includes('mod') || lowerMessage.includes('mods') || lowerMessage.includes('modification')) {
        response = "🎮 I can help you with mods! ExusCraft has amazing mods for games like Cyberpunk 2077, Skyrim, Minecraft, and more. You can browse by category (Graphics, Gameplay, UI/UX, Audio) or search for specific games. What type of mod are you looking for?";
    }
    else if (lowerMessage.includes('install') || lowerMessage.includes('how to') || lowerMessage.includes('setup')) {
        response = "📥 Installing mods is easy! Here's the general process:<br>1. Download the mod file<br>2. Extract if it's a ZIP file<br>3. Copy files to your game's mod folder<br>4. Enable the mod in-game or via mod manager<br><br>Each mod has specific installation instructions. Which game are you modding?";
    }
    else if (lowerMessage.includes('free') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
        response = "💰 We have both free and paid mods! Many high-quality mods are completely free. You can filter by 'Free Mods' in our navigation or look for the 'FREE' tag on mod cards. Premium mods offer advanced features and professional quality.";
    }
    else if (lowerMessage.includes('game') || lowerMessage.includes('games')) {
        response = "🎯 ExusCraft supports mods for popular games including:<br>• Cyberpunk 2077<br>• Skyrim<br>• Minecraft<br>• GTA V<br>• The Witcher 3<br>• Fallout 4<br>• Counter-Strike 2<br>• And many more!<br><br>Which game are you interested in?";
    }
    // Programming and development
    else if (lowerMessage.includes('javascript') || lowerMessage.includes('js') || lowerMessage.includes('programming') || lowerMessage.includes('code') || lowerMessage.includes('coding')) {
        response = "💻 <strong>Programming Help Available!</strong><br>I can help with:<br>• JavaScript, Python, C#, Java<br>• Web development (HTML, CSS, React)<br>• Game development<br>• Debugging and troubleshooting<br>• Code optimization<br>• Best practices<br><br>What programming question do you have?";
    }
    else if (lowerMessage.includes('python') || lowerMessage.includes('java') || lowerMessage.includes('c#') || lowerMessage.includes('html') || lowerMessage.includes('css')) {
        response = "🐍 I can help with that programming language! Whether you need help with:<br>• Syntax and basics<br>• Problem solving<br>• Code examples<br>• Best practices<br>• Debugging tips<br><br>Just ask your specific question and I'll help you out!";
    }
    // Technical support
    else if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('crash') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
        response = "🔧 <strong>Technical Support:</strong><br>I can help troubleshoot:<br>• Game crashes and errors<br>• Mod compatibility issues<br>• Performance problems<br>• Installation failures<br>• System requirements<br><br>Describe your specific issue and I'll help you fix it!";
    }
    else if (lowerMessage.includes('performance') || lowerMessage.includes('fps') || lowerMessage.includes('lag') || lowerMessage.includes('slow')) {
        response = "⚡ <strong>Performance Optimization:</strong><br>• Update graphics drivers<br>• Adjust in-game settings<br>• Close background applications<br>• Check system requirements<br>• Optimize mod load order<br>• Clear cache files<br><br>What specific performance issue are you experiencing?";
    }
    // Math and calculations
    else if (lowerMessage.includes('calculate') || lowerMessage.includes('math') || lowerMessage.includes('equation') || /\d+\s*[\+\-\*\/]\s*\d+/.test(lowerMessage)) {
        if (/(\d+)\s*[\+\-\*\/]\s*(\d+)/.test(lowerMessage)) {
            try {
                const result = eval(lowerMessage.replace(/[^0-9+\-*/().\s]/g, ''));
                response = `🧮 <strong>Calculation Result:</strong> ${result}<br><br>Need help with more complex math? I can assist with:<br>• Basic arithmetic<br>• Algebra<br>• Statistics<br>• Programming math<br>• Game calculations`;
            } catch (e) {
                response = "🧮 I can help with math! Try asking something like '25 * 17' or 'what is 100 / 4'. I can also help with more complex mathematical concepts!";
            }
        } else {
            response = "🧮 I can help with math and calculations! Try asking:<br>• Simple math: '25 * 17'<br>• Percentages: 'what is 15% of 200'<br>• Conversions<br>• Statistics<br>• Programming calculations<br><br>What would you like to calculate?";
        }
    }
    // Creative and writing
    else if (lowerMessage.includes('write') || lowerMessage.includes('story') || lowerMessage.includes('creative') || lowerMessage.includes('poem')) {
        response = "✍️ <strong>Creative Writing:</strong><br>I can help you with:<br>• Story ideas and plots<br>• Character development<br>• Writing tips and techniques<br>• Editing and proofreading<br>• Creative prompts<br>• Technical writing<br><br>What kind of writing project are you working on?";
    }
    // Science and learning
    else if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology') || lowerMessage.includes('explain')) {
        response = "🔬 <strong>Science & Learning:</strong><br>I can explain:<br>• Scientific concepts<br>• How things work<br>• Research topics<br>• Study help<br>• Technical explanations<br>• Educational content<br><br>What would you like to learn about?";
    }
    // News and current events
    else if (lowerMessage.includes('news') || lowerMessage.includes('latest') || lowerMessage.includes('update') || lowerMessage.includes('current')) {
        response = "📰 <strong>Latest Gaming & Tech News:</strong><br>I can discuss:<br>• Gaming industry updates<br>• New game releases<br>• Technology trends<br>• Hardware reviews<br>• Software updates<br>• Mod community news<br><br>What specific news topic interests you?";
    }
    // Help and support
    else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('assist')) {
        response = "🆘 I'm here to help! I specialize in:<br>• Finding mods for your games<br>• Installation & setup guidance<br>• Programming & development support<br>• Technical troubleshooting<br>• Game compatibility questions<br>• Performance optimization<br>• Math and calculations<br>• Creative writing<br>• Science explanations<br><br>What can I help you with today?";
    }
    // Gratitude
    else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciate')) {
        response = "You're welcome! 😊 Happy to help! If you have any other questions about mods, games, programming, or anything else, just ask. Enjoy exploring ExusCraft!";
    }
    // Farewells
    else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you')) {
        response = "Goodbye! 👋 Thanks for visiting ExusCraft. Come back anytime for the latest mods and games. Happy gaming!";
    }
    // Capabilities inquiry
    else if (lowerMessage.includes('what can you') || lowerMessage.includes('capabilities') || lowerMessage.includes('features')) {
        response = "🤖 <strong>I can help you with:</strong><br>• 🎮 Gaming & mod support<br>• 💻 Programming & development<br>• 🔧 Technical troubleshooting<br>• 🧮 Math & calculations<br>• ✍️ Writing & creativity<br>• 🔬 Science & explanations<br>• 📰 Tech news & updates<br>• 🆘 General questions & support<br><br>I'm like having a knowledgeable friend who loves gaming and tech!";
    }
    else {
        // Enhanced default response with more suggestions
        response = "🤔 I'd love to help with that! I'm great at answering questions about:<br>• 🎮 Gaming, mods & technical support<br>• 💻 Programming & development<br>• 🧮 Math & calculations<br>• ✍️ Creative writing & ideas<br>• 🔬 Science & explanations<br>• 📰 Tech news & trends<br><br>Try asking me something specific, or browse our mod categories to find what you're looking for!";
    }
    
    addMessage(response, 'bot');
}

// Check if query is gaming/modding related
function checkIfGamingQuery(message) {
    const gamingKeywords = [
        'mod', 'mods', 'modding', 'game', 'games', 'gaming',
        'install', 'setup', 'compatible', 'compatibility',
        'minecraft', 'cyberpunk', 'skyrim', 'fallout', 'gta', 'rust',
        'unity', 'unreal', 'engine', 'steam', 'nexus',
        'download', 'upload', 'create', 'build', 'develop',
        'graphics', 'gameplay', 'audio', 'ui', 'texture',
        'patch', 'update', 'version', 'release'
    ];
    
    return gamingKeywords.some(keyword => message.includes(keyword));
}

// Handle gaming-specific queries
async function handleGamingQuery(message, lowerMessage) {
    // Check if this requires internet search
    const needsWebSearch = checkIfNeedsWebSearch(lowerMessage);
    
    if (needsWebSearch) {
        return await handleWebSearchQuery(message, lowerMessage);
    }
    // Game information queries
    else if (lowerMessage.includes('game info') || lowerMessage.includes('tell me about') || lowerMessage.includes('what is')) {
        return await handleGameInfoQuery(message, lowerMessage);
    }
    // Latest gaming news
    else if (lowerMessage.includes('news') || lowerMessage.includes('latest') || lowerMessage.includes('update') || lowerMessage.includes('patch')) {
        return await handleGamingNewsQuery(message, lowerMessage);
    }
    // Mod installation and setup
    else if (lowerMessage.includes('install') || lowerMessage.includes('setup') || lowerMessage.includes('how to')) {
        return handleModInstallation(lowerMessage);
    }
    // Mod compatibility
    else if (lowerMessage.includes('compatible') || lowerMessage.includes('work with') || lowerMessage.includes('support')) {
        return handleModCompatibility(lowerMessage);
    }
    // Mod creation and development
    else if (lowerMessage.includes('create') || lowerMessage.includes('make') || lowerMessage.includes('develop') || lowerMessage.includes('build')) {
        return handleModCreation();
    }
    // Mod categories and recommendations
    else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best')) {
        return handleModRecommendations(lowerMessage);
    }
    // Free mods
    else if (lowerMessage.includes('free') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
        return handleFreeMods();
    }
    // Mod troubleshooting
    else if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('bug') || lowerMessage.includes('crash') || lowerMessage.includes('error')) {
        return handleModTroubleshooting();
    }
    // Mod engines and platforms
    else if (lowerMessage.includes('engine') || lowerMessage.includes('unity') || lowerMessage.includes('unreal')) {
        return handleModEngines(lowerMessage);
    }
    // Community and sharing
    else if (lowerMessage.includes('community') || lowerMessage.includes('share') || lowerMessage.includes('upload')) {
        return handleCommunityFeatures();
    }
    // Mod licensing and legal
    else if (lowerMessage.includes('license') || lowerMessage.includes('legal') || lowerMessage.includes('copyright')) {
        return handleModLicensing();
    }
    else {
        return handleDefault(message);
    }
}

// Handle general queries (like ChatGPT)
async function handleGeneralQuery(message, lowerMessage) {
    // Greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return handleGeneralGreeting();
    }
    // Math and calculations
    else if (lowerMessage.includes('calculate') || lowerMessage.includes('math') || lowerMessage.includes('solve') || /\d+[\+\-\*\/]\d+/.test(message)) {
        return handleMathQuery(message);
    }
    // Programming questions
    else if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('javascript') || lowerMessage.includes('python') || lowerMessage.includes('html') || lowerMessage.includes('css')) {
        return handleProgrammingQuery(message);
    }
    // Science questions
    else if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology')) {
        return handleScienceQuery(message);
    }
    // History questions
    else if (lowerMessage.includes('history') || lowerMessage.includes('when did') || lowerMessage.includes('who was') || lowerMessage.includes('what happened')) {
        return handleHistoryQuery(message);
    }
    // Technology questions
    else if (lowerMessage.includes('technology') || lowerMessage.includes('computer') || lowerMessage.includes('software') || lowerMessage.includes('hardware')) {
        return handleTechnologyQuery(message);
    }
    // Creative writing
    else if (lowerMessage.includes('write') || lowerMessage.includes('story') || lowerMessage.includes('poem') || lowerMessage.includes('creative')) {
        return handleCreativeQuery(message);
    }
    // General help
    else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return handleGeneralAIHelp();
    }
    // Philosophy and deep questions
    else if (lowerMessage.includes('meaning') || lowerMessage.includes('purpose') || lowerMessage.includes('philosophy') || lowerMessage.includes('why do')) {
        return handlePhilosophyQuery(message);
    }
    // Current events and news
    else if (lowerMessage.includes('news') || lowerMessage.includes('current') || lowerMessage.includes('today') || lowerMessage.includes('happening')) {
        return handleCurrentEventsQuery(message);
    }
    // Default general response
    else {
        return handleGeneralDefault(message);
    }
}

// Handle mod installation
function handleModInstallation(message) {
    if (message.includes('unity')) {
        return `<p>🔧 <strong>Unity Mod Installation:</strong></p>
                <ul>
                    <li>📁 Extract mod files to game's Mods folder</li>
                    <li>🔌 Install BepInEx or MelonLoader if required</li>
                    <li>📋 Check mod dependencies and load order</li>
                    <li>🎮 Launch game and verify mod is active</li>
                </ul>
                <p>💡 Always backup your save files before installing mods!</p>`;
    }
    
    return `<p>📥 <strong>General Mod Installation Guide:</strong></p>
            <ul>
                <li>📁 <strong>Extract Files:</strong> Unzip mod to correct game directory</li>
                <li>🔧 <strong>Check Dependencies:</strong> Install required frameworks (BepInEx, SKSE, etc.)</li>
                <li>📋 <strong>Read Instructions:</strong> Follow mod-specific installation notes</li>
                <li>⚙️ <strong>Configure Settings:</strong> Adjust mod options in-game or config files</li>
                <li>🎮 <strong>Test & Verify:</strong> Launch game and check mod functionality</li>
            </ul>
            <p>Need help with a specific game engine? Just ask!</p>`;
}

// Handle mod compatibility
function handleModCompatibility(message) {
    if (message.includes('version')) {
        return `<p>🔄 <strong>Mod Version Compatibility:</strong></p>
                <ul>
                    <li>✅ Check mod's supported game version</li>
                    <li>📋 Verify engine compatibility (Unity, Unreal, etc.)</li>
                    <li>🔧 Look for updated versions or patches</li>
                    <li>👥 Check community forums for compatibility reports</li>
                </ul>
                <p>Most mods specify compatible game versions in their descriptions!</p>`;
    }
    
    return `<p>🎯 <strong>Mod Compatibility Check:</strong></p>
            <ul>
                <li>🎮 <strong>Game Version:</strong> Ensure mod supports your game version</li>
                <li>🔧 <strong>Engine Type:</strong> Match mod engine with your game</li>
                <li>💻 <strong>Platform:</strong> PC, Mac, Linux compatibility varies</li>
                <li>🔌 <strong>Dependencies:</strong> Check required frameworks and libraries</li>
                <li>⚠️ <strong>Conflicts:</strong> Some mods may conflict with others</li>
            </ul>
            <p>Each mod page shows detailed compatibility information!</p>`;
}

// Handle mod creation
function handleModCreation() {
    return `<p>🛠️ <strong>Creating Your Own Mods:</strong></p>
            <div style="margin: 1rem 0;">
                <h4 style="color: var(--accent-primary);">Getting Started:</h4>
                <ul>
                    <li>📚 Learn the game's modding framework</li>
                    <li>🔧 Download modding tools (Unity Editor, Creation Kit, etc.)</li>
                    <li>📖 Study existing mods for reference</li>
                    <li>👥 Join modding communities for support</li>
                </ul>
            </div>
            <div style="margin: 1rem 0;">
                <h4 style="color: var(--accent-primary);">Popular Tools:</h4>
                <ul>
                    <li>🎮 <strong>Unity:</strong> Unity Editor + BepInEx</li>
                    <li>🏗️ <strong>Unreal:</strong> Unreal Editor + Blueprint system</li>
                    <li>⚔️ <strong>Skyrim:</strong> Creation Kit + SKSE</li>
                    <li>🎯 <strong>Minecraft:</strong> Forge, Fabric, or Bukkit</li>
                </ul>
            </div>
            <p>Ready to share your creation? Use our admin panel to upload!</p>`;
}

// Handle mod recommendations
function handleModRecommendations(message) {
    if (message.includes('graphics') || message.includes('visual')) {
        return `<p>🎨 <strong>Best Graphics Mods:</strong></p>
                <ul>
                    <li>🌟 <strong>Lighting Overhauls:</strong> Enhanced shadows and illumination</li>
                    <li>🌿 <strong>Texture Packs:</strong> High-resolution textures and materials</li>
                    <li>🌊 <strong>Weather Systems:</strong> Realistic weather and atmosphere</li>
                    <li>✨ <strong>Post-Processing:</strong> Bloom, depth of field, color grading</li>
                </ul>
                <p>Browse our Graphics category for the latest visual enhancements!</p>`;
    }
    
    if (message.includes('gameplay')) {
        return `<p>⚔️ <strong>Top Gameplay Mods:</strong></p>
                <ul>
                    <li>🎯 <strong>Mechanics Overhauls:</strong> New combat, crafting, or progression systems</li>
                    <li>🗺️ <strong>Content Expansions:</strong> New quests, areas, and storylines</li>
                    <li>⚖️ <strong>Balance Changes:</strong> Difficulty adjustments and rebalancing</li>
                    <li>🎮 <strong>Quality of Life:</strong> UI improvements and convenience features</li>
                </ul>
                <p>Check our Gameplay category for game-changing modifications!</p>`;
    }
    
    return `<p>🎯 <strong>Popular Mod Categories:</strong></p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <h4 style="color: var(--accent-primary);">Visual Enhancement</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Graphics overhauls</li>
                        <li>Texture improvements</li>
                        <li>Lighting systems</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-primary);">Gameplay</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Mechanics changes</li>
                        <li>New content</li>
                        <li>Balance adjustments</li>
                    </ul>
                </div>
            </div>
            <p>What type of mods are you looking for?</p>`;
}

// Handle free mods
function handleFreeMods() {
    return `<p>🆓 <strong>Free Mods on ExusCraft:</strong></p>
            <ul>
                <li>✅ <strong>Community Contributions:</strong> Many creators offer free mods</li>
                <li>🎯 <strong>Filter by Price:</strong> Use "Free Mods" section in navigation</li>
                <li>💝 <strong>Donation Support:</strong> Support creators with optional donations</li>
                <li>⭐ <strong>Quality Assured:</strong> All mods reviewed for quality and safety</li>
            </ul>
            <p>Browse our Free Mods section to discover amazing community creations!</p>`;
}

// Handle mod troubleshooting
function handleModTroubleshooting() {
    return `<p>🛠️ <strong>Mod Troubleshooting Guide:</strong></p>
            <p><strong>Common Issues:</strong></p>
            <ul>
                <li>🚫 <strong>Mod Won't Load:</strong> Check dependencies and load order</li>
                <li>💥 <strong>Game Crashes:</strong> Disable conflicting mods, update frameworks</li>
                <li>🎮 <strong>Performance Issues:</strong> Reduce mod settings, check system requirements</li>
                <li>🔧 <strong>Missing Features:</strong> Verify mod installation and configuration</li>
            </ul>
            <p><strong>Quick Fixes:</strong></p>
            <ul>
                <li>📁 Verify file integrity and installation path</li>
                <li>🔄 Update game and modding frameworks</li>
                <li>📋 Check mod compatibility with current game version</li>
                <li>👥 Consult mod comments and community forums</li>
            </ul>`;
}

// Handle mod engines
function handleModEngines(message) {
    if (message.includes('unity')) {
        return `<p>🔧 <strong>Unity Engine Modding:</strong></p>
                <ul>
                    <li>🔌 <strong>BepInEx:</strong> Most popular Unity modding framework</li>
                    <li>🍯 <strong>MelonLoader:</strong> Alternative framework for Unity games</li>
                    <li>📁 <strong>Installation:</strong> Usually goes in game root directory</li>
                    <li>🎯 <strong>Compatibility:</strong> Works with most Unity-based games</li>
                </ul>
                <p>Unity mods typically modify game behavior through code injection!</p>`;
    }
    
    if (message.includes('unreal')) {
        return `<p>🏗️ <strong>Unreal Engine Modding:</strong></p>
                <ul>
                    <li>📦 <strong>Pak Files:</strong> Mods packaged as .pak files</li>
                    <li>📁 <strong>Installation:</strong> Usually in game's Paks/Mods folder</li>
                    <li>🎨 <strong>Blueprint Support:</strong> Visual scripting modifications</li>
                    <li>🔧 <strong>UE4/UE5:</strong> Different versions may need different approaches</li>
                </ul>
                <p>Unreal mods often replace or add game assets and blueprints!</p>`;
    }
    
    return `<p>🎮 <strong>Supported Game Engines:</strong></p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <h4 style="color: var(--accent-primary);">Popular Engines</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Unity (BepInEx, MelonLoader)</li>
                        <li>Unreal Engine (Pak mods)</li>
                        <li>Source Engine (VPK files)</li>
                        <li>Creation Engine (ESP/ESM)</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-primary);">Specialized</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>REDengine (Cyberpunk 2077)</li>
                        <li>Frostbite (limited support)</li>
                        <li>CryEngine (Pak/XML mods)</li>
                        <li>Custom engines</li>
                    </ul>
                </div>
            </div>`;
}

// Handle community features
function handleCommunityFeatures() {
    return `<p>👥 <strong>ExusCraft Community:</strong></p>
            <ul>
                <li>📤 <strong>Upload Mods:</strong> Share your creations with the community</li>
                <li>⭐ <strong>Rate & Review:</strong> Help others find quality mods</li>
                <li>💬 <strong>Comments:</strong> Discuss mods with creators and users</li>
                <li>🔔 <strong>Follow Creators:</strong> Get notified of new releases</li>
                <li>📊 <strong>Analytics:</strong> Track your mod's popularity and downloads</li>
            </ul>
            <p>Ready to contribute? Contact an admin for upload permissions!</p>`;
}

// Handle mod licensing
function handleModLicensing() {
    return `<p>⚖️ <strong>Mod Licensing & Legal:</strong></p>
            <ul>
                <li>📜 <strong>Creator Rights:</strong> Mod creators retain ownership of their work</li>
                <li>🎮 <strong>Game Assets:</strong> Cannot redistribute copyrighted game content</li>
                <li>🆓 <strong>Free Use:</strong> Many mods allow free personal use</li>
                <li>💰 <strong>Commercial Use:</strong> Check individual mod licenses</li>
                <li>🔄 <strong>Modifications:</strong> Some mods allow derivative works</li>
            </ul>
            <p>Always respect mod creators' licensing terms and game EULAs!</p>`;
}
function handleGameRecommendations(message) {
    const availableGames = games.slice(0, 3); // Get first 3 games
    
    if (message.includes('rpg')) {
        const rpgGames = games.filter(g => g.category === 'RPG' || g.tags.includes('RPG'));
        if (rpgGames.length > 0) {
            return `<p>🎯 Perfect! Here are some amazing RPG games:</p>
                    ${rpgGames.slice(0, 2).map(game => 
                        `<a href="#" onclick="showGameDetails('${game._id}')" class="game-link">
                            <i class="fas fa-gamepad"></i>
                            ${game.title} - $${game.price}
                        </a>`
                    ).join('')}
                    <p>Click on any game to see full details!</p>`;
        }
    }
    
    if (message.includes('action')) {
        const actionGames = games.filter(g => g.category === 'Action' || g.tags.includes('Action'));
        if (actionGames.length > 0) {
            return `<p>💥 Great choice! Here are some thrilling action games:</p>
                    ${actionGames.slice(0, 2).map(game => 
                        `<a href="#" onclick="showGameDetails('${game._id}')" class="game-link">
                            <i class="fas fa-gamepad"></i>
                            ${game.title} - $${game.price}
                        </a>`
                    ).join('')}`;
        }
    }
    
    return `<p>🎮 Based on our current collection, I recommend these popular games:</p>
            ${availableGames.map(game => 
                `<a href="#" onclick="showGameDetails('${game._id}')" class="game-link">
                    <i class="fas fa-gamepad"></i>
                    ${game.title} - $${game.price} ⭐${game.rating}
                </a>`
            ).join('')}
            <p>What genre interests you most? RPG, Action, Strategy, or Adventure?</p>`;
}

// Handle sales inquiry
function handleSalesInquiry() {
    const saleGames = games.slice(6, 9).map(game => ({
        ...game,
        originalPrice: game.price + 20,
        discount: 25
    }));
    
    return `<p>🏷️ Great timing! Here are our current deals:</p>
            ${saleGames.map(game => 
                `<a href="#" onclick="showGameDetails('${game._id}')" class="game-link">
                    <i class="fas fa-fire"></i>
                    ${game.title} - $${game.price} <s>$${game.originalPrice}</s> (25% OFF!)
                </a>`
            ).join('')}
            <p>💰 Save big on these amazing titles! Limited time offers.</p>`;
}

// Handle refund inquiry
function handleRefundInquiry() {
    return `<p>🔄 <strong>Refund Policy:</strong></p>
            <ul>
                <li>✅ 14-day refund window from purchase</li>
                <li>⏱️ Less than 2 hours of playtime</li>
                <li>💳 Refunds processed within 3-5 business days</li>
                <li>📧 Contact support with your order ID</li>
            </ul>
            <p>Need to request a refund? I can help you get started!</p>`;
}

// Handle purchase help
function handlePurchaseHelp() {
    return `<p>💳 <strong>Purchase Help:</strong></p>
            <ul>
                <li>🛒 Add games to cart and checkout securely</li>
                <li>💰 We accept all major credit cards</li>
                <li>🔒 SSL encrypted payment processing</li>
                <li>📧 Instant download links via email</li>
                <li>☁️ Games saved to your account forever</li>
            </ul>
            <p>Having trouble with a purchase? Let me know what's happening!</p>`;
}

// Handle system requirements
function handleSystemRequirements() {
    return `<p>💻 <strong>System Requirements:</strong></p>
            <p>Each game has detailed minimum and recommended specs. Here's what to check:</p>
            <ul>
                <li>🖥️ Operating System (Windows 10/11)</li>
                <li>⚡ Processor (CPU)</li>
                <li>🧠 Memory (RAM)</li>
                <li>🎮 Graphics Card (GPU)</li>
                <li>💾 Storage Space</li>
            </ul>
            <p>Click on any game to see its specific requirements!</p>`;
}

// Handle specific game
function handleSpecificGame(gameId, gameTitle) {
    const game = games.find(g => g._id === gameId);
    if (game) {
        return `<p>🎮 <strong>${gameTitle}</strong></p>
                <p>${game.description}</p>
                <a href="#" onclick="showGameDetails('${gameId}')" class="game-link">
                    <i class="fas fa-info-circle"></i>
                    View Full Details - $${game.price}
                </a>
                <p>⭐ Rating: ${game.rating}/5 | Category: ${game.category}</p>`;
    }
    return `<p>I'd love to help you with that game! Let me search our catalog for you.</p>`;
}

// Handle general help
function handleGeneralHelp() {
    return `<p>🤖 <strong>I'm ExusBot, your ExusCraft AI Assistant!</strong> I can help you with:</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                <div>
                    <h4 style="color: var(--accent-primary); margin-bottom: 0.5rem;">🔧 Mod Installation</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Installation guides</li>
                        <li>Compatibility checking</li>
                        <li>Framework setup</li>
                        <li>Troubleshooting issues</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-primary); margin-bottom: 0.5rem;">🎯 Mod Discovery</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Category recommendations</li>
                        <li>Free mod browsing</li>
                        <li>Quality assessments</li>
                        <li>Creator spotlights</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-primary); margin-bottom: 0.5rem;">🛠️ Mod Creation</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Development guidance</li>
                        <li>Tool recommendations</li>
                        <li>Publishing process</li>
                        <li>Community guidelines</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-primary); margin-bottom: 0.5rem;">🌐 Gaming Intel</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Latest game news</li>
                        <li>Game information</li>
                        <li>System requirements</li>
                        <li>Release updates</li>
                    </ul>
                </div>
            </div>
            <p><strong>Try asking:</strong> "How do I install Unity mods?" • "Tell me about Cyberpunk 2077" • "Latest gaming news" • "What are the best graphics mods?" • "Minecraft system requirements"</p>`;
}

// Handle greeting
function handleGreeting() {
    const greetings = [
        "Hello! Welcome to ExusCraft! 🔧 How can I help you with modding today?",
        "Hey there, modder! 👋 Ready to discover some amazing community creations?",
        "Hi! I'm ExusBot, your modding assistant. What kind of mods are you looking for?",
        "Welcome! 🎯 Looking for mod recommendations, installation help, or creation guidance?"
    ];
    return `<p>${greetings[Math.floor(Math.random() * greetings.length)]}</p>`;
}

// Handle default response
function handleDefault(message) {
    const responses = [
        `<p>🤔 I'm not sure about that, but I can help you with mods! Try asking about:</p>
         <ul>
             <li>"How do I install mods?"</li>
             <li>"What are the best graphics mods?"</li>
             <li>"Are there free mods available?"</li>
             <li>"Tell me about [game name]"</li>
             <li>"Latest news about [game]"</li>
         </ul>`,
        `<p>💭 Hmm, let me help you with something mod-related! What are you looking for?</p>
         <p>I can help with installation, recommendations, creation, troubleshooting, or get the latest gaming info!</p>`,
        `<p>🔧 I specialize in modding questions and gaming info! Ask me about mod installation, compatibility, creation, community features, or current gaming news.</p>`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Check if query needs web search
function checkIfNeedsWebSearch(message) {
    const webSearchKeywords = [
        'latest', 'current', 'recent', 'new', 'update', 'patch', 'version',
        'release date', 'when', 'price', 'cost', 'review', 'rating',
        'system requirements', 'specs', 'minimum', 'recommended',
        'multiplayer', 'online', 'servers', 'population',
        'dlc', 'expansion', 'season pass', 'content',
        'developer', 'publisher', 'studio', 'company',
        'trailer', 'gameplay', 'screenshots', 'video'
    ];
    
    return webSearchKeywords.some(keyword => message.includes(keyword));
}

// Handle web search queries
async function handleWebSearchQuery(originalMessage, lowerMessage) {
    try {
        // Show that we're searching
        addMessage(`<p>🔍 <strong>Searching the web for information...</strong></p>`, 'bot');
        
        // Simulate web search (in a real implementation, you'd call an actual search API)
        const searchResults = await simulateWebSearch(originalMessage);
        
        return `<p>🌐 <strong>Here's what I found online:</strong></p>
                ${searchResults}
                <p><small>💡 <em>Information gathered from the internet. For the most current details, check official sources.</em></small></p>`;
    } catch (error) {
        return `<p>❌ <strong>Sorry, I couldn't search the web right now.</strong></p>
                <p>But I can still help you with modding questions! Try asking about mod installation, compatibility, or creation.</p>`;
    }
}

// Handle game information queries
async function handleGameInfoQuery(originalMessage, lowerMessage) {
    try {
        // Extract game name from message
        const gameName = extractGameName(originalMessage);
        
        if (!gameName) {
            return `<p>🎮 <strong>Which game would you like to know about?</strong></p>
                    <p>Try asking: "Tell me about Minecraft" or "What is Cyberpunk 2077?"</p>`;
        }
        
        // Show that we're searching
        addMessage(`<p>🔍 <strong>Looking up information about ${gameName}...</strong></p>`, 'bot');
        
        const gameInfo = await simulateGameInfoSearch(gameName);
        
        return `<p>🎮 <strong>Information about ${gameName}:</strong></p>
                ${gameInfo}
                <p>🔧 <strong>Looking for mods?</strong> Check our ${gameName} mod collection or ask me about specific mod types!</p>`;
    } catch (error) {
        return `<p>❌ <strong>Couldn't find game information right now.</strong></p>
                <p>But I can help you find mods for any game! What type of mods are you looking for?</p>`;
    }
}

// Handle gaming news queries
async function handleGamingNewsQuery(originalMessage, lowerMessage) {
    try {
        // Show that we're searching
        addMessage(`<p>📰 <strong>Fetching latest gaming news...</strong></p>`, 'bot');
        
        const newsResults = await simulateGamingNews(originalMessage);
        
        return `<p>📰 <strong>Latest Gaming News:</strong></p>
                ${newsResults}
                <p>🔧 <strong>Interested in mods for these games?</strong> Ask me about mod recommendations or installation!</p>`;
    } catch (error) {
        return `<p>❌ <strong>Couldn't fetch news right now.</strong></p>
                <p>But I can help you with modding questions! What would you like to know about mods?</p>`;
    }
}

// Simulate web search (replace with real API in production)
async function simulateWebSearch(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const searchTopics = {
        'minecraft': {
            title: 'Minecraft',
            info: `<ul>
                <li>🎮 <strong>Latest Version:</strong> 1.20.4 (December 2023)</li>
                <li>💰 <strong>Price:</strong> $26.95 (Java Edition)</li>
                <li>👥 <strong>Players:</strong> 140+ million monthly active users</li>
                <li>🔧 <strong>Mod Support:</strong> Extensive (Forge, Fabric, Bukkit)</li>
                <li>📱 <strong>Platforms:</strong> PC, Mobile, Console, VR</li>
            </ul>`
        },
        'cyberpunk': {
            title: 'Cyberpunk 2077',
            info: `<ul>
                <li>🎮 <strong>Latest Update:</strong> Patch 2.1 (December 2023)</li>
                <li>💰 <strong>Price:</strong> $29.99 (frequently on sale)</li>
                <li>⭐ <strong>Rating:</strong> 86/100 (Metacritic) - Much improved!</li>
                <li>🔧 <strong>Mod Support:</strong> Growing community (REDmod tools)</li>
                <li>🚀 <strong>DLC:</strong> Phantom Liberty expansion available</li>
            </ul>`
        },
        'skyrim': {
            title: 'The Elder Scrolls V: Skyrim',
            info: `<ul>
                <li>🎮 <strong>Edition:</strong> Anniversary Edition (2021)</li>
                <li>💰 <strong>Price:</strong> $39.99 (Special Edition)</li>
                <li>🔧 <strong>Mod Support:</strong> Legendary (60,000+ mods on Nexus)</li>
                <li>📦 <strong>Creation Club:</strong> Official mod marketplace</li>
                <li>🏆 <strong>Legacy:</strong> 12+ years of active modding community</li>
            </ul>`
        }
    };
    
    // Find relevant topic
    const lowerQuery = query.toLowerCase();
    for (const [key, data] of Object.entries(searchTopics)) {
        if (lowerQuery.includes(key)) {
            return data.info;
        }
    }
    
    // Generic gaming info
    return `<ul>
        <li>🎮 <strong>Gaming Industry:</strong> $184 billion market (2023)</li>
        <li>🔧 <strong>Modding:</strong> Increasingly popular across all platforms</li>
        <li>📈 <strong>Trends:</strong> VR, AI integration, cross-platform play</li>
        <li>🌐 <strong>Community:</strong> 3+ billion gamers worldwide</li>
    </ul>`;
}

// Simulate game info search
async function simulateGameInfoSearch(gameName) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const gameDatabase = {
        'minecraft': `<ul>
            <li>🏗️ <strong>Genre:</strong> Sandbox, Survival, Creative</li>
            <li>👨‍💻 <strong>Developer:</strong> Mojang Studios (Microsoft)</li>
            <li>📅 <strong>Release:</strong> November 18, 2011</li>
            <li>🔧 <strong>Mod Ecosystem:</strong> 100,000+ mods available</li>
            <li>🌟 <strong>Popular Mods:</strong> OptiFine, JEI, Biomes O' Plenty</li>
        </ul>`,
        'cyberpunk 2077': `<ul>
            <li>🏗️ <strong>Genre:</strong> Action RPG, Open World</li>
            <li>👨‍💻 <strong>Developer:</strong> CD Projekt RED</li>
            <li>📅 <strong>Release:</strong> December 10, 2020</li>
            <li>🔧 <strong>Mod Support:</strong> REDmod, community tools</li>
            <li>🌟 <strong>Popular Mods:</strong> Cyber Engine Tweaks, Appearance Menu</li>
        </ul>`,
        'skyrim': `<ul>
            <li>🏗️ <strong>Genre:</strong> Action RPG, Fantasy</li>
            <li>👨‍💻 <strong>Developer:</strong> Bethesda Game Studios</li>
            <li>📅 <strong>Release:</strong> November 11, 2011</li>
            <li>🔧 <strong>Mod Support:</strong> Creation Kit, SKSE</li>
            <li>🌟 <strong>Popular Mods:</strong> SkyUI, Unofficial Patch, SMIM</li>
        </ul>`
    };
    
    const lowerName = gameName.toLowerCase();
    for (const [key, info] of Object.entries(gameDatabase)) {
        if (lowerName.includes(key.toLowerCase())) {
            return info;
        }
    }
    
    return `<ul>
        <li>🔍 <strong>Game:</strong> ${gameName}</li>
        <li>💡 <strong>Tip:</strong> Check official websites for latest info</li>
        <li>🔧 <strong>Mods:</strong> Most modern games support modding</li>
        <li>🌐 <strong>Resources:</strong> Steam Workshop, Nexus Mods, ModDB</li>
    </ul>`;
}

// Simulate gaming news
async function simulateGamingNews(query) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentDate = new Date().toLocaleDateString();
    
    return `<div style="margin: 1rem 0;">
        <h4 style="color: var(--accent-primary); margin-bottom: 0.5rem;">🔥 Trending Now (${currentDate})</h4>
        <ul>
            <li>🎮 <strong>Minecraft 1.21 Update:</strong> New biomes and mobs announced</li>
            <li>🚀 <strong>Cyberpunk 2077:</strong> Major performance improvements in latest patch</li>
            <li>⚔️ <strong>Skyrim Modding:</strong> New Creation Kit features released</li>
            <li>🔧 <strong>Unity Engine:</strong> Better mod support tools announced</li>
        </ul>
        
        <h4 style="color: var(--accent-primary); margin: 1rem 0 0.5rem 0;">📈 Modding Community</h4>
        <ul>
            <li>🌟 <strong>Nexus Mods:</strong> 50+ million downloads this month</li>
            <li>🎯 <strong>Steam Workshop:</strong> New mod discovery features</li>
            <li>👥 <strong>Community:</strong> Record number of mod creators active</li>
        </ul>
    </div>`;
}

// Extract game name from user message
function extractGameName(message) {
    const gamePatterns = [
        /tell me about (.+)/i,
        /what is (.+)/i,
        /info about (.+)/i,
        /(.+) game/i,
        /(.+) mods/i
    ];
    
    for (const pattern of gamePatterns) {
        const match = message.match(pattern);
        if (match) {
            return match[1].trim();
        }
    }
    
    // Common game names
    const commonGames = ['minecraft', 'cyberpunk', 'skyrim', 'fallout', 'gta', 'rust', 'witcher'];
    const lowerMessage = message.toLowerCase();
    
    for (const game of commonGames) {
        if (lowerMessage.includes(game)) {
            return game.charAt(0).toUpperCase() + game.slice(1);
        }
    }
    
    return null;
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});

// ===== GENERAL AI ASSISTANT FUNCTIONS (LIKE CHATGPT) =====

// Handle general greeting
function handleGeneralGreeting() {
    const greetings = [
        "Hello! I'm ExusBot, your AI assistant! 👋 I can help with gaming, modding, programming, math, science, and much more. What would you like to know?",
        "Hi there! 🤖 I'm here to help with anything you need - from gaming questions to general knowledge, coding help, or creative tasks. How can I assist you?",
        "Hey! Welcome to ExusCraft! 🎮 I'm ExusBot, and I can help with mods, games, programming, science, math, writing, and pretty much anything else. What's on your mind?",
        "Greetings! ✨ I'm your AI assistant ExusBot. Whether you need help with gaming, coding, learning, or just want to chat about anything, I'm here for you!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
}

// Handle math queries
function handleMathQuery(message) {
    try {
        // Extract math expression
        const mathMatch = message.match(/(\d+[\+\-\*\/\(\)\s\d]*\d+)/);
        if (mathMatch) {
            // Simple calculator (be careful with eval in production)
            const expression = mathMatch[1].replace(/[^0-9+\-*/().\s]/g, '');
            try {
                const result = Function('"use strict"; return (' + expression + ')')();
                return `<p>🧮 <strong>Math Calculation:</strong></p>
                        <p><code>${expression} = ${result}</code></p>
                        <p>Need help with more complex math? I can assist with algebra, geometry, calculus concepts, and more!</p>`;
            } catch (e) {
                return `<p>🧮 <strong>Math Help:</strong></p>
                        <p>I can help you with various math topics:</p>
                        <ul>
                            <li>📊 Basic arithmetic and calculations</li>
                            <li>📐 Geometry and trigonometry</li>
                            <li>📈 Algebra and equations</li>
                            <li>∫ Calculus concepts</li>
                            <li>📊 Statistics and probability</li>
                        </ul>
                        <p>Try asking: "What is 25 * 4?" or "Explain the Pythagorean theorem"</p>`;
            }
        }
        
        return `<p>🧮 <strong>Math & Science Helper:</strong></p>
                <p>I can help you with:</p>
                <ul>
                    <li>🔢 Calculations and arithmetic</li>
                    <li>📐 Geometry and shapes</li>
                    <li>📊 Statistics and data analysis</li>
                    <li>🧪 Physics and chemistry problems</li>
                    <li>💡 Mathematical concepts and explanations</li>
                </ul>
                <p>What math problem can I help you solve?</p>`;
    } catch (error) {
        return `<p>🧮 I'd be happy to help with math! Try asking me to calculate something or explain a mathematical concept.</p>`;
    }
}

// Handle programming queries
function handleProgrammingQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
        return `<p>💻 <strong>JavaScript Help:</strong></p>
                <ul>
                    <li>🔧 <strong>Syntax:</strong> Variables, functions, objects, arrays</li>
                    <li>🌐 <strong>DOM:</strong> Manipulating web pages</li>
                    <li>⚡ <strong>Async:</strong> Promises, async/await, fetch API</li>
                    <li>🎯 <strong>ES6+:</strong> Arrow functions, destructuring, modules</li>
                    <li>⚛️ <strong>Frameworks:</strong> React, Vue, Angular concepts</li>
                </ul>
                <p>Need help with a specific JavaScript problem? Just ask!</p>`;
    }
    
    if (lowerMessage.includes('python')) {
        return `<p>🐍 <strong>Python Programming:</strong></p>
                <ul>
                    <li>📚 <strong>Basics:</strong> Variables, loops, functions, classes</li>
                    <li>📊 <strong>Data Science:</strong> pandas, numpy, matplotlib</li>
                    <li>🌐 <strong>Web:</strong> Django, Flask, FastAPI</li>
                    <li>🤖 <strong>AI/ML:</strong> scikit-learn, TensorFlow basics</li>
                    <li>🔧 <strong>Automation:</strong> Scripts and tools</li>
                </ul>
                <p>What Python concept would you like help with?</p>`;
    }
    
    if (lowerMessage.includes('html') || lowerMessage.includes('css')) {
        return `<p>🎨 <strong>Web Development:</strong></p>
                <ul>
                    <li>🏗️ <strong>HTML:</strong> Structure, semantic elements, forms</li>
                    <li>🎨 <strong>CSS:</strong> Styling, flexbox, grid, animations</li>
                    <li>📱 <strong>Responsive:</strong> Mobile-first design</li>
                    <li>✨ <strong>Modern CSS:</strong> Variables, transforms, transitions</li>
                    <li>🔧 <strong>Tools:</strong> Preprocessors, frameworks</li>
                </ul>
                <p>Need help building or styling a website?</p>`;
    }
    
    return `<p>💻 <strong>Programming Assistant:</strong></p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                <div>
                    <h4 style="color: var(--accent-primary);">Languages I Help With:</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>JavaScript & TypeScript</li>
                        <li>Python & Django</li>
                        <li>HTML & CSS</li>
                        <li>React & Vue</li>
                        <li>Node.js & Express</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-primary);">I Can Help With:</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Code debugging</li>
                        <li>Algorithm explanations</li>
                        <li>Best practices</li>
                        <li>Project structure</li>
                        <li>Learning roadmaps</li>
                    </ul>
                </div>
            </div>
            <p>What programming challenge are you working on?</p>`;
}

// Handle science queries
function handleScienceQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('physics')) {
        return `<p>⚛️ <strong>Physics Concepts:</strong></p>
                <ul>
                    <li>🌍 <strong>Mechanics:</strong> Motion, forces, energy</li>
                    <li>⚡ <strong>Electricity:</strong> Circuits, magnetism</li>
                    <li>🌊 <strong>Waves:</strong> Sound, light, electromagnetic</li>
                    <li>🔬 <strong>Quantum:</strong> Basic quantum mechanics</li>
                    <li>🌌 <strong>Relativity:</strong> Time, space, gravity</li>
                </ul>
                <p>What physics topic interests you?</p>`;
    }
    
    if (lowerMessage.includes('chemistry')) {
        return `<p>🧪 <strong>Chemistry Help:</strong></p>
                <ul>
                    <li>⚛️ <strong>Atoms:</strong> Structure, periodic table</li>
                    <li>🔗 <strong>Bonding:</strong> Ionic, covalent, metallic</li>
                    <li>⚖️ <strong>Reactions:</strong> Balancing equations</li>
                    <li>🌡️ <strong>Thermodynamics:</strong> Energy changes</li>
                    <li>🧬 <strong>Organic:</strong> Carbon compounds</li>
                </ul>
                <p>Need help with a chemistry concept?</p>`;
    }
    
    return `<p>🔬 <strong>Science Explorer:</strong></p>
            <ul>
                <li>⚛️ <strong>Physics:</strong> Forces, energy, quantum mechanics</li>
                <li>🧪 <strong>Chemistry:</strong> Elements, reactions, molecules</li>
                <li>🧬 <strong>Biology:</strong> Life processes, evolution, genetics</li>
                <li>🌍 <strong>Earth Science:</strong> Geology, climate, space</li>
                <li>💻 <strong>Computer Science:</strong> Algorithms, data structures</li>
            </ul>
            <p>What scientific topic would you like to explore?</p>`;
}

// Handle history queries
function handleHistoryQuery(message) {
    return `<p>📚 <strong>History & Knowledge:</strong></p>
            <ul>
                <li>🏛️ <strong>Ancient:</strong> Egypt, Greece, Rome, civilizations</li>
                <li>🏰 <strong>Medieval:</strong> Middle Ages, Renaissance</li>
                <li>🌍 <strong>Modern:</strong> Industrial Revolution, World Wars</li>
                <li>🗽 <strong>Contemporary:</strong> 20th-21st century events</li>
                <li>👑 <strong>Figures:</strong> Important historical people</li>
            </ul>
            <p>I can help explain historical events, analyze causes and effects, and provide context for understanding the past.</p>
            <p>What historical topic interests you?</p>`;
}

// Handle technology queries
function handleTechnologyQuery(message) {
    return `<p>💻 <strong>Technology Guide:</strong></p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                <div>
                    <h4 style="color: var(--accent-primary);">Hardware:</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>🖥️ Computer components</li>
                        <li>📱 Mobile devices</li>
                        <li>🎮 Gaming hardware</li>
                        <li>🔧 Troubleshooting</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-primary);">Software:</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>💾 Operating systems</li>
                        <li>🌐 Web technologies</li>
                        <li>🔒 Cybersecurity</li>
                        <li>🤖 AI and automation</li>
                    </ul>
                </div>
            </div>
            <p>Need help with tech problems, recommendations, or explanations?</p>`;
}

// Handle creative queries
function handleCreativeQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('story')) {
        return `<p>📖 <strong>Creative Writing - Story Ideas:</strong></p>
                <p>Here are some story prompts to inspire you:</p>
                <ul>
                    <li>🚀 A gamer discovers their favorite mod actually controls reality</li>
                    <li>🏰 In a world where code is magic, programmers are wizards</li>
                    <li>🤖 An AI assistant becomes self-aware during a gaming session</li>
                    <li>🌌 A modder accidentally creates a portal to game worlds</li>
                </ul>
                <p>Would you like me to help develop any of these ideas or create a custom story prompt?</p>`;
    }
    
    if (lowerMessage.includes('poem')) {
        return `<p>🎭 <strong>Poetry & Creative Expression:</strong></p>
                <p>I can help you with:</p>
                <ul>
                    <li>✍️ Writing poems in different styles</li>
                    <li>🎵 Rhyme schemes and meter</li>
                    <li>🌟 Creative inspiration and prompts</li>
                    <li>📝 Editing and improving your work</li>
                </ul>
                <p>What type of poem would you like to create? Haiku, sonnet, free verse, or something else?</p>`;
    }
    
    return `<p>🎨 <strong>Creative Assistant:</strong></p>
            <ul>
                <li>📖 <strong>Writing:</strong> Stories, poems, scripts, articles</li>
                <li>💡 <strong>Ideas:</strong> Brainstorming and inspiration</li>
                <li>🎭 <strong>Characters:</strong> Development and dialogue</li>
                <li>🌍 <strong>Worldbuilding:</strong> Settings and lore</li>
                <li>✏️ <strong>Editing:</strong> Improving and refining work</li>
            </ul>
            <p>What creative project can I help you with?</p>`;
}

// Handle philosophy queries
function handlePhilosophyQuery(message) {
    return `<p>🤔 <strong>Philosophy & Deep Thinking:</strong></p>
            <p>These are profound questions that humans have pondered for millennia. Here are some perspectives:</p>
            <ul>
                <li>💭 <strong>Meaning:</strong> Often found through relationships, creativity, and contribution</li>
                <li>🎯 <strong>Purpose:</strong> Can be self-determined through values and goals</li>
                <li>🌱 <strong>Growth:</strong> Learning and helping others gives life significance</li>
                <li>🤝 <strong>Connection:</strong> Relationships and community provide fulfillment</li>
                <li>🎨 <strong>Creation:</strong> Making something meaningful, like mods or art</li>
            </ul>
            <p>Philosophy encourages us to think critically about existence, ethics, and knowledge. What aspect interests you most?</p>`;
}

// Handle current events
function handleCurrentEventsQuery(message) {
    return `<p>📰 <strong>Current Events & News:</strong></p>
            <p>I can help you understand:</p>
            <ul>
                <li>🌍 <strong>Global Events:</strong> Major world developments</li>
                <li>💻 <strong>Technology:</strong> Latest tech innovations</li>
                <li>🎮 <strong>Gaming:</strong> Industry news and updates</li>
                <li>🔬 <strong>Science:</strong> Recent discoveries and breakthroughs</li>
                <li>📊 <strong>Analysis:</strong> Context and implications</li>
            </ul>
            <p>💡 <strong>Note:</strong> For the most current news, I recommend checking reliable news sources. I can help explain topics and provide context!</p>
            <p>What current topic would you like to discuss?</p>`;
}

// Handle general AI help
function handleGeneralAIHelp() {
    return `<p>🤖 <strong>I'm ExusBot - Your Complete AI Assistant!</strong></p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                <div>
                    <h4 style="color: var(--accent-primary);">🎮 Gaming & Mods</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Mod installation & troubleshooting</li>
                        <li>Game recommendations</li>
                        <li>Gaming news & updates</li>
                        <li>Mod creation guidance</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-primary);">💻 Programming & Tech</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Code help & debugging</li>
                        <li>Web development</li>
                        <li>Technology explanations</li>
                        <li>Best practices</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-primary);">📚 Learning & Knowledge</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Math & science help</li>
                        <li>History & research</li>
                        <li>Concept explanations</li>
                        <li>Study assistance</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--accent-primary);">🎨 Creative & Personal</h4>
                    <ul style="font-size: 0.9rem;">
                        <li>Creative writing</li>
                        <li>Problem solving</li>
                        <li>Brainstorming ideas</li>
                        <li>General conversation</li>
                    </ul>
                </div>
            </div>
            <p><strong>Just ask me anything!</strong> I'm here to help with whatever you need. 😊</p>`;
}

// Handle general default responses
function handleGeneralDefault(message) {
    const responses = [
        `<p>🤔 That's an interesting question! While I might not have a specific answer for that, I can help you with:</p>
         <ul>
             <li>🎮 Gaming and modding questions</li>
             <li>💻 Programming and technology</li>
             <li>📚 Learning and explanations</li>
             <li>🎨 Creative projects and writing</li>
             <li>🧮 Math and science problems</li>
         </ul>
         <p>Try rephrasing your question or ask me about something else!</p>`,
        
        `<p>💭 I'm not sure about that specific topic, but I'm here to help! I can assist with:</p>
         <ul>
             <li>🔧 Technical problems and solutions</li>
             <li>📖 Explanations and learning</li>
             <li>💡 Creative ideas and brainstorming</li>
             <li>🎯 Problem-solving approaches</li>
         </ul>
         <p>What would you like to explore together?</p>`,
        
        `<p>🌟 I'd love to help you with that! While I might need more context, I excel at:</p>
         <ul>
             <li>🎮 Gaming, mods, and tech support</li>
             <li>💻 Programming and development</li>
             <li>🧠 Learning and education</li>
             <li>✨ Creative and analytical thinking</li>
         </ul>
         <p>Feel free to ask me anything - I'm here to assist! 😊</p>`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Enhanced Rating System
function showRatingModal(modId) {
    if (!currentUser) {
        showMessage('Please log in to rate mods', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content rating-modal">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Rate this Mod</h2>
            <div class="rating-stars" id="ratingStars">
                ${[1,2,3,4,5].map(i => `
                    <i class="fas fa-star rating-star" data-rating="${i}" onclick="selectRating(${i})"></i>
                `).join('')}
            </div>
            <textarea id="reviewText" placeholder="Write a review (optional)" rows="4"></textarea>
            <div class="modal-actions">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn btn-outline">Cancel</button>
                <button onclick="submitRating('${modId}')" class="btn btn-primary">Submit Rating</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// ===== FALLBACK FUNCTIONS TO ENSURE BUTTONS WORK =====

// Make sure all functions are globally available
window.showLogin = showLogin;
window.showRegister = showRegister;
window.toggleCart = toggleCart;
window.toggleChatbot = toggleChatbot;
window.toggleGameDropdown = toggleGameDropdown;
window.filterByGame = filterByGame;
window.checkLoginAndNavigate = checkLoginAndNavigate;
window.checkLoginAndExplore = checkLoginAndExplore;
window.closeModal = closeModal;
window.closeAuthModal = closeAuthModal;
window.sendMessage = sendMessage;
window.handleChatKeyPress = handleChatKeyPress;
window.askBot = askBot;

// Simple test functions
window.testLogin = function() {
    console.log('Login button clicked');
    showLogin();
};

window.testRegister = function() {
    console.log('Register button clicked');
    showRegister();
};

window.testChat = function() {
    console.log('Chat button clicked');
    toggleChatbot();
};

console.log('All functions loaded and available globally');
// ===== PERFORMANCE OPTIMIZATIONS =====

// Debounce function to limit function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimize scroll events
const optimizedScrollHandler = throttle(function() {
    // Handle scroll events here if needed
}, 16); // ~60fps

// Optimize resize events
const optimizedResizeHandler = debounce(function() {
    // Handle resize events here if needed
}, 250);

// Add optimized event listeners
if (typeof window !== 'undefined') {
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    window.addEventListener('resize', optimizedResizeHandler, { passive: true });
}

// Optimize DOM queries by caching elements
const domCache = {
    navbar: null,
    chatbot: null,
    cart: null,
    loading: null,
    
    get(id) {
        if (!this[id]) {
            this[id] = document.getElementById(id);
        }
        return this[id];
    }
};

// Use cached DOM elements
function getCachedElement(id) {
    return domCache.get(id) || document.getElementById(id);
}

// Optimize animation frame requests
let animationFrameId;
function requestOptimizedFrame(callback) {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(callback);
}

// Memory management - clean up event listeners
window.addEventListener('beforeunload', function() {
    // Clean up any remaining timeouts or intervals
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});

console.log('Performance optimizations loaded');