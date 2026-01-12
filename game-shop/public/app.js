// Global variables
let currentUser = null;
let games = [];
let cart = [];
let stripe = null;

// Sample games data (fallback when MongoDB is not available)
const sampleGames = [
    {
        _id: '1',
        title: "Cyber Nexus 2077",
        description: "Immerse yourself in a dystopian cyberpunk world where technology and humanity collide. Make choices that shape the future of Neo-Tokyo in this epic RPG adventure.",
        price: 59.99,
        category: "RPG",
        images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop"],
        downloadUrl: "https://example.com/download/cyber-nexus-2077",
        systemRequirements: {
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
        },
        tags: ["Cyberpunk", "Open World", "Story Rich", "Futuristic"],
        rating: 4.8,
        featured: true
    },
    {
        _id: '2',
        title: "Mystic Realms: Chronicles",
        description: "Embark on an epic fantasy journey through magical realms filled with ancient mysteries, powerful spells, and legendary creatures waiting to be discovered.",
        price: 49.99,
        category: "Adventure",
        images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"],
        downloadUrl: "https://example.com/download/mystic-realms",
        systemRequirements: {
            minimum: {
                os: "Windows 10 64-bit",
                processor: "Intel Core i3-8100 / AMD Ryzen 3 2200G",
                memory: "6 GB RAM",
                graphics: "NVIDIA GTX 1050 / AMD RX 560",
                storage: "35 GB available space"
            },
            recommended: {
                os: "Windows 11 64-bit",
                processor: "Intel Core i5-10400 / AMD Ryzen 5 3600",
                memory: "12 GB RAM",
                graphics: "NVIDIA RTX 3060 / AMD RX 6600",
                storage: "35 GB SSD space"
            }
        },
        tags: ["Fantasy", "Magic", "Adventure", "Exploration"],
        rating: 4.6,
        featured: true
    },
    {
        _id: '3',
        title: "Stellar Command",
        description: "Build and command your space fleet in this strategic masterpiece. Explore galaxies, manage resources, and engage in tactical battles across the cosmos.",
        price: 39.99,
        category: "Strategy",
        images: ["https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop"],
        downloadUrl: "https://example.com/download/stellar-command",
        systemRequirements: {
            minimum: {
                os: "Windows 10 64-bit",
                processor: "Intel Core i3-7100 / AMD Ryzen 3 1200",
                memory: "4 GB RAM",
                graphics: "NVIDIA GTX 950 / AMD RX 460",
                storage: "25 GB available space"
            },
            recommended: {
                os: "Windows 11 64-bit",
                processor: "Intel Core i5-9400 / AMD Ryzen 5 2600",
                memory: "8 GB RAM",
                graphics: "NVIDIA GTX 1660 / AMD RX 5500 XT",
                storage: "25 GB SSD space"
            }
        },
        tags: ["Space", "Strategy", "Management", "Tactical"],
        rating: 4.4,
        featured: false
    },
    {
        _id: '4',
        title: "Neon Racer X",
        description: "Experience high-octane racing in a neon-soaked futuristic city. Customize your ride, master impossible tracks, and dominate the underground racing scene.",
        price: 29.99,
        category: "Racing",
        images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"],
        downloadUrl: "https://example.com/download/neon-racer-x",
        systemRequirements: {
            minimum: {
                os: "Windows 10 64-bit",
                processor: "Intel Core i3-8100 / AMD Ryzen 3 2200G",
                memory: "6 GB RAM",
                graphics: "NVIDIA GTX 1050 Ti / AMD RX 570",
                storage: "20 GB available space"
            },
            recommended: {
                os: "Windows 11 64-bit",
                processor: "Intel Core i5-10400 / AMD Ryzen 5 3600",
                memory: "12 GB RAM",
                graphics: "NVIDIA RTX 3060 / AMD RX 6600",
                storage: "20 GB SSD space"
            }
        },
        tags: ["Racing", "Futuristic", "Customization", "Arcade"],
        rating: 4.3,
        featured: false
    },
    {
        _id: '5',
        title: "Shadow Ops: Infiltration",
        description: "Master the art of stealth in this tactical espionage thriller. Use cutting-edge gadgets and strategic thinking to complete impossible missions.",
        price: 44.99,
        category: "Action",
        images: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop"],
        downloadUrl: "https://example.com/download/shadow-ops",
        systemRequirements: {
            minimum: {
                os: "Windows 10 64-bit",
                processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
                memory: "8 GB RAM",
                graphics: "NVIDIA GTX 1060 / AMD RX 580",
                storage: "40 GB available space"
            },
            recommended: {
                os: "Windows 11 64-bit",
                processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
                memory: "16 GB RAM",
                graphics: "NVIDIA RTX 3070 / AMD RX 6700 XT",
                storage: "40 GB SSD space"
            }
        },
        tags: ["Stealth", "Tactical", "Espionage", "Single Player"],
        rating: 4.7,
        featured: true
    },
    {
        _id: '6',
        title: "Puzzle Dimension",
        description: "Challenge your mind with mind-bending 3D puzzles that defy logic. Each level presents unique mechanics and increasingly complex challenges.",
        price: 19.99,
        category: "Puzzle",
        images: ["https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop"],
        downloadUrl: "https://example.com/download/puzzle-dimension",
        systemRequirements: {
            minimum: {
                os: "Windows 10 64-bit",
                processor: "Intel Core i3-6100 / AMD Ryzen 3 1200",
                memory: "4 GB RAM",
                graphics: "NVIDIA GTX 750 Ti / AMD RX 460",
                storage: "8 GB available space"
            },
            recommended: {
                os: "Windows 11 64-bit",
                processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
                memory: "8 GB RAM",
                graphics: "NVIDIA GTX 1050 / AMD RX 560",
                storage: "8 GB SSD space"
            }
        },
        tags: ["Puzzle", "3D", "Logic", "Relaxing"],
        rating: 4.2,
        featured: false
    },
    {
        _id: '7',
        title: "Indie Dreams",
        description: "A heartwarming indie adventure about following your dreams. Beautiful hand-drawn art meets compelling storytelling in this emotional journey.",
        price: 24.99,
        category: "Indie",
        images: ["https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop"],
        downloadUrl: "https://example.com/download/indie-dreams",
        systemRequirements: {
            minimum: {
                os: "Windows 10 64-bit",
                processor: "Intel Core i3-6100 / AMD Ryzen 3 1200",
                memory: "4 GB RAM",
                graphics: "NVIDIA GTX 750 Ti / AMD RX 460",
                storage: "12 GB available space"
            },
            recommended: {
                os: "Windows 11 64-bit",
                processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
                memory: "8 GB RAM",
                graphics: "NVIDIA GTX 1050 / AMD RX 560",
                storage: "12 GB SSD space"
            }
        },
        tags: ["Indie", "Story Rich", "Emotional", "Hand-drawn"],
        rating: 4.9,
        featured: false
    },
    {
        _id: '8',
        title: "Sports Arena 2024",
        description: "The ultimate sports simulation featuring multiple disciplines. Compete in tournaments, build your career, and become a legendary athlete.",
        price: 54.99,
        category: "Sports",
        images: ["https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop"],
        downloadUrl: "https://example.com/download/sports-arena-2024",
        systemRequirements: {
            minimum: {
                os: "Windows 10 64-bit",
                processor: "Intel Core i5-8400 / AMD Ryzen 5 2600",
                memory: "8 GB RAM",
                graphics: "NVIDIA GTX 1060 / AMD RX 580",
                storage: "45 GB available space"
            },
            recommended: {
                os: "Windows 11 64-bit",
                processor: "Intel Core i7-10700K / AMD Ryzen 7 3700X",
                memory: "16 GB RAM",
                graphics: "NVIDIA RTX 3070 / AMD RX 6700 XT",
                storage: "45 GB SSD space"
            }
        },
        tags: ["Sports", "Simulation", "Career Mode", "Multiplayer"],
        rating: 4.1,
        featured: false
    },
    {
        _id: '9',
        title: "City Builder Pro",
        description: "Design and manage the city of your dreams. Balance economics, environment, and citizen happiness in this comprehensive city simulation.",
        price: 34.99,
        category: "Simulation",
        images: ["https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop"],
        downloadUrl: "https://example.com/download/city-builder-pro",
        systemRequirements: {
            minimum: {
                os: "Windows 10 64-bit",
                processor: "Intel Core i3-8100 / AMD Ryzen 3 2200G",
                memory: "6 GB RAM",
                graphics: "NVIDIA GTX 1050 / AMD RX 560",
                storage: "30 GB available space"
            },
            recommended: {
                os: "Windows 11 64-bit",
                processor: "Intel Core i5-10400 / AMD Ryzen 5 3600",
                memory: "12 GB RAM",
                graphics: "NVIDIA RTX 3060 / AMD RX 6600",
                storage: "30 GB SSD space"
            }
        },
        tags: ["City Builder", "Management", "Strategy", "Sandbox"],
        rating: 4.5,
        featured: true
    }
];

// Initialize app with cinematic loading
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        initializeApp();
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
    
    // Setup scroll animations
    setupScrollAnimations();
    setupNavbarScroll();
});

// Cinematic scroll animations
function setupScrollAnimations() {
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
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .game-card').forEach(el => {
        observer.observe(el);
    });
}

// Navbar scroll effect
function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize the app
function initializeApp() {
    loadGames();
    loadFeaturedGames();
    loadDealsGames();
    updateNavigation();
    updateCartDisplay();
}

// API helper functions
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    };
    
    const response = await fetch(`/api${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
}

// Auth functions
async function login(email, password) {
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        localStorage.setItem('token', data.token);
        currentUser = data.user;
        updateNavigation();
        closeAuthModal();
        showMessage(data.message || 'Login successful!', 'success');
        
        // Show email verification reminder if not verified
        if (!data.user.isEmailVerified) {
            setTimeout(() => {
                showEmailVerificationReminder();
            }, 2000);
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function register(username, email, password) {
    try {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        
        localStorage.setItem('token', data.token);
        currentUser = data.user;
        updateNavigation();
        closeAuthModal();
        showMessage(data.message || 'Registration successful!', 'success');
        
        // Show email verification notice
        setTimeout(() => {
            showEmailVerificationNotice();
        }, 2000);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function resendVerificationEmail() {
    try {
        const data = await apiCall('/auth/resend-verification', {
            method: 'POST'
        });
        showMessage(data.message, 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function forgotPassword(email) {
    try {
        const data = await apiCall('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        showMessage(data.message, 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function fetchCurrentUser() {
    try {
        const data = await apiCall('/auth/me');
        currentUser = data;
        updateNavigation();
    } catch (error) {
        localStorage.removeItem('token');
        currentUser = null;
        updateNavigation();
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    cart = [];
    updateNavigation();
    updateCartDisplay();
    showHome();
    showMessage('Logged out successfully!', 'success');
}

// Navigation functions
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

// Page navigation
function showHome() {
    document.getElementById('homeSection').style.display = 'block';
    document.getElementById('gamesSection').style.display = 'none';
}

function showGames() {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('gamesSection').style.display = 'block';
    loadGames();
}

// Game functions
async function loadGames(category = '', search = '') {
    try {
        // Try to load from API first
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        
        try {
            const data = await apiCall(`/games?${params}`);
            games = data.games;
        } catch (error) {
            // Fallback to sample games if API fails
            console.log('API unavailable, using sample games');
            games = sampleGames.filter(game => {
                const matchesCategory = !category || game.category === category;
                const matchesSearch = !search || 
                    game.title.toLowerCase().includes(search.toLowerCase()) || 
                    game.description.toLowerCase().includes(search.toLowerCase()) ||
                    (game.tags && game.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())));
                return matchesCategory && matchesSearch;
            });
        }
        
        displayGames(games);
    } catch (error) {
        // Final fallback
        games = sampleGames;
        displayGames(games);
        showMessage('Using demo games - database not connected', 'error');
    }
}

function displayGames(gamesToShow) {
    const gamesGrid = document.getElementById('gamesGrid');
    
    if (gamesToShow.length === 0) {
        gamesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--text-dark); margin-bottom: 1rem;">No games found</h3>
                <p style="color: var(--text-light);">Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    gamesGrid.innerHTML = gamesToShow.map(game => {
        const stars = '★'.repeat(Math.floor(game.rating || 4)) + '☆'.repeat(5 - Math.floor(game.rating || 4));
        const tags = game.tags ? game.tags.slice(0, 3) : ['Action', 'Adventure'];
        
        return `
            <div class="game-card" onclick="showGameDetails('${game._id}')">
                ${game.featured ? '<div class="featured-badge">Featured</div>' : ''}
                <div class="game-image">
                    ${game.images && game.images[0] ? 
                        `<img src="${game.images[0]}" alt="${game.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\"fas fa-gamepad\\"></i>';">` :
                        '<i class="fas fa-gamepad"></i>'
                    }
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    
                    <div class="game-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-text">${(game.rating || 4.0).toFixed(1)}</span>
                    </div>
                    
                    <div class="game-tags">
                        ${tags.map(tag => `<span class="game-tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="game-meta">
                        <div class="game-price">$${game.price.toFixed(2)}</div>
                        <div class="game-category">${game.category}</div>
                    </div>
                    
                    <button onclick="event.stopPropagation(); addToCart('${game._id}')" class="btn btn-primary btn-full">
                        <i class="fas fa-cart-plus"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function showGameDetails(gameId) {
    try {
        let game;
        try {
            game = await apiCall(`/games/${gameId}`);
        } catch (error) {
            // Fallback to sample games
            game = sampleGames.find(g => g._id === gameId);
            if (!game) {
                throw new Error('Game not found');
            }
        }
        
        const stars = '★'.repeat(Math.floor(game.rating || 4)) + '☆'.repeat(5 - Math.floor(game.rating || 4));
        
        document.getElementById('gameDetails').innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 2rem;">
                <div>
                    <img src="${game.images && game.images[0] ? game.images[0] : 'https://via.placeholder.com/400x300/667eea/ffffff?text=Game+Image'}" 
                         alt="${game.title}" 
                         style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--border-radius); box-shadow: var(--shadow-medium);"
                         onerror="this.src='https://via.placeholder.com/400x300/667eea/ffffff?text=Game+Image';">
                </div>
                <div>
                    <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${game.title}</h2>
                    
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                        <span class="game-category">${game.category}</span>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: #ffd700; font-size: 1.2rem;">${stars}</span>
                            <span style="font-weight: 600; color: var(--text-light);">${(game.rating || 4.0).toFixed(1)}/5</span>
                        </div>
                    </div>
                    
                    <div style="font-size: 2.5rem; font-weight: 800; color: var(--primary-color); margin-bottom: 2rem;">
                        $${game.price.toFixed(2)}
                    </div>
                    
                    ${game.tags ? `
                        <div style="margin-bottom: 2rem;">
                            <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">Tags:</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <button onclick="addToCart('${game._id}')" class="btn btn-primary btn-large" style="width: 100%;">
                        <i class="fas fa-cart-plus"></i>
                        Add to Cart - $${game.price.toFixed(2)}
                    </button>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-dark);">About This Game</h3>
                <p style="line-height: 1.8; color: var(--text-light); font-size: 1.1rem;">${game.description}</p>
            </div>
            
            ${game.systemRequirements ? `
                <div>
                    <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-dark);">System Requirements</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius);">
                            <h4 style="color: var(--primary-color); margin-bottom: 1rem; font-weight: 700;">Minimum</h4>
                            <div style="space-y: 0.5rem;">
                                <p><strong>OS:</strong> ${game.systemRequirements.minimum?.os || 'Windows 10'}</p>
                                <p><strong>Processor:</strong> ${game.systemRequirements.minimum?.processor || 'Intel i3 / AMD Ryzen 3'}</p>
                                <p><strong>Memory:</strong> ${game.systemRequirements.minimum?.memory || '8 GB RAM'}</p>
                                <p><strong>Graphics:</strong> ${game.systemRequirements.minimum?.graphics || 'GTX 1050 / RX 560'}</p>
                                <p><strong>Storage:</strong> ${game.systemRequirements.minimum?.storage || '25 GB'}</p>
                            </div>
                        </div>
                        <div style="background: var(--bg-primary); padding: 1.5rem; border-radius: var(--border-radius);">
                            <h4 style="color: var(--success-color); margin-bottom: 1rem; font-weight: 700;">Recommended</h4>
                            <div style="space-y: 0.5rem;">
                                <p><strong>OS:</strong> ${game.systemRequirements.recommended?.os || 'Windows 11'}</p>
                                <p><strong>Processor:</strong> ${game.systemRequirements.recommended?.processor || 'Intel i5 / AMD Ryzen 5'}</p>
                                <p><strong>Memory:</strong> ${game.systemRequirements.recommended?.memory || '16 GB RAM'}</p>
                                <p><strong>Graphics:</strong> ${game.systemRequirements.recommended?.graphics || 'GTX 1660 / RX 6600'}</p>
                                <p><strong>Storage:</strong> ${game.systemRequirements.recommended?.storage || '25 GB SSD'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
        
        document.getElementById('gameModal').style.display = 'block';
    } catch (error) {
        showMessage('Failed to load game details', 'error');
    }
}

// Filter and search functions
function filterGames() {
    const category = document.getElementById('categoryFilter').value;
    const search = document.getElementById('searchInput').value;
    loadGames(category, search);
}

function searchGames() {
    const search = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    
    if (search.length >= 2 || search.length === 0) {
        loadGames(category, search);
    }
}

// Cart functions
function addToCart(gameId) {
    if (!currentUser) {
        showLogin();
        showMessage('Please login to add games to cart', 'error');
        return;
    }
    
    // Find game in current games array or sample games
    const game = games.find(g => g._id === gameId) || sampleGames.find(g => g._id === gameId);
    if (game && !cart.find(item => item._id === gameId)) {
        cart.push(game);
        updateCartDisplay();
        showMessage(`${game.title} added to cart!`, 'success');
    } else if (cart.find(item => item._id === gameId)) {
        showMessage('Game already in cart!', 'error');
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
            <div style="text-align: center; padding: 3rem 1rem; color: var(--text-light);">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 0.5rem;">Your cart is empty</h3>
                <p>Add some games to get started!</p>
            </div>
        `;
        cartTotal.textContent = '0.00';
        return;
    }
    
    const total = cart.reduce((sum, game) => sum + game.price, 0);
    cartTotal.textContent = total.toFixed(2);
    
    cartItems.innerHTML = cart.map(game => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${game.title}</h4>
                <p>$${game.price.toFixed(2)}</p>
                <small style="color: var(--text-light);">${game.category}</small>
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

// Checkout function
async function checkout() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    if (cart.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    try {
        const gameIds = cart.map(game => game._id);
        const { clientSecret, amount } = await apiCall('/orders/create-payment-intent', {
            method: 'POST',
            body: JSON.stringify({ gameIds })
        });
        
        // For demo purposes, simulate successful payment
        // In production, you would integrate with Stripe Elements
        const confirmed = confirm(`Confirm purchase of $${amount.toFixed(2)}?`);
        
        if (confirmed) {
            // Simulate payment success
            const result = await apiCall('/orders/confirm-purchase', {
                method: 'POST',
                body: JSON.stringify({ 
                    paymentIntentId: 'demo_payment_' + Date.now(),
                    gameIds 
                })
            });
            
            cart = [];
            updateCartDisplay();
            toggleCart();
            showMessage('Purchase successful! Check your library for download links.', 'success');
        }
    } catch (error) {
        showMessage('Checkout failed: ' + error.message, 'error');
    }
}

// Modal functions
function closeModal() {
    document.getElementById('gameModal').style.display = 'none';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// Auth modal functions
function showLogin() {
    document.getElementById('authContent').innerHTML = `
        <div class="auth-form">
            <h2>Login to GameHub</h2>
            <form onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn btn-primary btn-full">Login</button>
            </form>
            <p style="text-align: center; margin-top: 1.5rem; color: var(--text-secondary);">
                <a href="#" onclick="showForgotPassword()" style="color: var(--primary-purple); text-decoration: none;">Forgot Password?</a>
            </p>
            <p style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
                Don't have an account? <a href="#" onclick="showRegister()" style="color: var(--primary-purple); text-decoration: none;">Sign up</a>
            </p>
        </div>
    `;
    document.getElementById('authModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('authContent').innerHTML = `
        <div class="auth-form">
            <h2>Join GameHub</h2>
            <form onsubmit="handleRegister(event)">
                <div class="form-group">
                    <label for="registerUsername">Username</label>
                    <input type="text" id="registerUsername" placeholder="Choose a username" required>
                </div>
                <div class="form-group">
                    <label for="registerEmail">Email</label>
                    <input type="email" id="registerEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="registerPassword">Password</label>
                    <input type="password" id="registerPassword" placeholder="Create a password" required minlength="6">
                    <small>Password must be at least 6 characters long</small>
                </div>
                <button type="submit" class="btn btn-primary btn-full">Create Account</button>
            </form>
            <p style="text-align: center; margin-top: 1.5rem; color: var(--text-secondary);">
                Already have an account? <a href="#" onclick="showLogin()" style="color: var(--primary-purple); text-decoration: none;">Login</a>
            </p>
        </div>
    `;
    document.getElementById('authModal').style.display = 'block';
}

function showForgotPassword() {
    document.getElementById('authContent').innerHTML = `
        <div class="auth-form">
            <h2>Forgot Password</h2>
            <p style="color: #666; margin-bottom: 1rem;">Enter your email address and we'll send you a link to reset your password.</p>
            <form onsubmit="handleForgotPassword(event)">
                <div class="form-group">
                    <label for="forgotEmail">Email</label>
                    <input type="email" id="forgotEmail" required>
                </div>
                <button type="submit" class="btn btn-primary btn-full">Send Reset Link</button>
            </form>
            <p style="text-align: center; margin-top: 1rem;">
                Remember your password? <a href="#" onclick="showLogin()">Login</a>
            </p>
        </div>
    `;
    document.getElementById('authModal').style.display = 'block';
}

function showEmailVerificationNotice() {
    const notice = document.createElement('div');
    notice.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 4000;
        max-width: 400px;
        text-align: center;
    `;
    
    notice.innerHTML = `
        <h3 style="color: #667eea; margin-bottom: 1rem;">📧 Check Your Email!</h3>
        <p style="margin-bottom: 1.5rem; color: #666;">
            We've sent a verification email to your inbox. Please click the link in the email to verify your account.
        </p>
        <button onclick="this.parentElement.remove()" class="btn btn-primary" style="margin-right: 0.5rem;">Got it!</button>
        <button onclick="resendVerificationEmail(); this.parentElement.remove();" class="btn btn-outline">Resend Email</button>
    `;
    
    document.body.appendChild(notice);
    
    setTimeout(() => {
        if (notice.parentElement) {
            notice.remove();
        }
    }, 10000);
}

function showEmailVerificationReminder() {
    if (currentUser && !currentUser.isEmailVerified) {
        const reminder = document.createElement('div');
        reminder.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #ff9500;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 3000;
            max-width: 300px;
            cursor: pointer;
        `;
        
        reminder.innerHTML = `
            <strong>⚠️ Email Not Verified</strong><br>
            <small>Click to resend verification email</small>
        `;
        
        reminder.onclick = () => {
            resendVerificationEmail();
            reminder.remove();
        };
        
        document.body.appendChild(reminder);
        
        setTimeout(() => {
            if (reminder.parentElement) {
                reminder.remove();
            }
        }, 8000);
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
}

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    register(username, email, password);
}

function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    forgotPassword(email);
    closeAuthModal();
}

// Utility functions
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#2ed573' : '#ff4757'};
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

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