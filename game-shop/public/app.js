// Global variables
let currentUser = null;
let mods = [];
let cart = [];
let currentTheme = 'dark';

// Real mod data with proper images and functionality
const realMods = [
    {
        _id: 'sodium',
        title: 'Sodium',
        description: 'Sodium is a free and open-source rendering optimization mod for Minecraft which greatly improves frame rates and stuttering while fixing many graphical issues. Compatible with Fabric and provides massive performance improvements.',
        shortDescription: 'Powerful rendering optimization mod for Minecraft',
        price: 0,
        isFree: true,
        category: 'Performance',
        gameTitle: 'Minecraft',
        author: 'CaffeineMC',
        images: ['https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=400&h=250&fit=crop&auto=format'],
        version: '0.5.8',
        rating: 4.9,
        downloads: 45000000,
        featured: true,
        status: 'finalised',
        tags: ['performance', 'optimization', 'fps', 'rendering'],
        requirements: 'Minecraft 1.20+, Fabric Loader',
        specs: 'Minimum: 4GB RAM, Recommended: 8GB RAM'
    },
    {
        _id: 'iris',
        title: 'Iris Shaders',
        description: 'Iris is a modern shader mod for Minecraft intended to be compatible with existing OptiFine shader packs. It works seamlessly with Sodium for incredible performance while maintaining stunning visual effects.',
        shortDescription: 'Modern shader mod compatible with Sodium',
        price: 0,
        isFree: true,
        category: 'Graphics',
        gameTitle: 'Minecraft',
        author: 'IrisShaders',
        images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=250&fit=crop&auto=format'],
        version: '1.6.17',
        rating: 4.8,
        downloads: 32000000,
        featured: true,
        status: 'finalised',
        tags: ['shaders', 'graphics', 'visual', 'optifine'],
        requirements: 'Minecraft 1.20+, Fabric Loader, Sodium (recommended)',
        specs: 'Minimum: 6GB RAM, GTX 1060 or equivalent'
    },
    {
        _id: 'create',
        title: 'Create Mod',
        description: 'Create is a mod offering a variety of tools and blocks for building, decoration, and aesthetic automation. The mod provides players with a comprehensive system for creating complex contraptions and beautiful builds.',
        shortDescription: 'Building, decoration and automation mod',
        price: 0,
        isFree: true,
        category: 'Gameplay',
        gameTitle: 'Minecraft',
        author: 'simibubi',
        images: ['https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop&auto=format'],
        version: '0.5.1f',
        rating: 4.9,
        downloads: 28000000,
        featured: true,
        status: 'finalised',
        tags: ['automation', 'building', 'tech', 'machinery'],
        requirements: 'Minecraft 1.20+, Forge or Fabric',
        specs: 'Minimum: 4GB RAM, Recommended: 6GB RAM'
    },
    {
        _id: 'lithium',
        title: 'Lithium',
        description: 'Lithium is a general-purpose optimization mod for Minecraft which works to improve game physics, mob AI, block ticking, and more without changing vanilla gameplay mechanics.',
        shortDescription: 'General-purpose server optimization mod',
        price: 0,
        isFree: true,
        category: 'Performance',
        gameTitle: 'Minecraft',
        author: 'CaffeineMC',
        images: ['https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=250&fit=crop&auto=format'],
        version: '0.12.1',
        rating: 4.8,
        downloads: 22000000,
        featured: false,
        status: 'finalised',
        tags: ['performance', 'server', 'optimization'],
        requirements: 'Minecraft 1.20+, Fabric Loader',
        specs: 'Works on any system, server-side optimization'
    },
    {
        _id: 'jei',
        title: 'Just Enough Items (JEI)',
        description: 'JEI is an item and recipe viewing mod for Minecraft, built from the ground up for stability and performance. View recipes, uses, and more with this essential utility mod.',
        shortDescription: 'Item and recipe viewing mod',
        price: 0,
        isFree: true,
        category: 'UI/UX',
        gameTitle: 'Minecraft',
        author: 'mezz',
        images: ['https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=250&fit=crop&auto=format'],
        version: '15.2.0',
        rating: 4.9,
        downloads: 180000000,
        featured: false,
        status: 'finalised',
        tags: ['utility', 'recipes', 'items', 'gui'],
        requirements: 'Minecraft 1.20+, Forge',
        specs: 'Minimum: 2GB RAM'
    },
    {
        _id: 'cs2plugin',
        title: 'CS2 Style Competitive Plugin',
        description: 'Transform your Counter-Strike 2 server into a competitive esports experience! Features 5v5 matchmaking, bomb plant/defuse mechanics, buy menus, economy system, ranking, tournaments, weapon skins, achievements and more.',
        shortDescription: 'Complete CS2-style competitive gameplay system',
        price: 24.99,
        isFree: false,
        category: 'Gameplay',
        gameTitle: 'Counter-Strike 2',
        author: 'ExusCraft',
        images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop&auto=format'],
        version: '2.1.0',
        rating: 4.9,
        downloads: 45230,
        featured: true,
        status: 'in-progress',
        tags: ['competitive', 'cs2', 'matchmaking', '5v5', 'esports'],
        requirements: 'Counter-Strike 2 Dedicated Server, SourceMod',
        specs: 'Dedicated server with 4GB RAM minimum'
    },
    {
        _id: 'skyui',
        title: 'SkyUI',
        description: 'SkyUI is an elegant, PC-friendly interface mod with many advanced features. Includes improved inventory management, magic menu overhaul, and essential modding framework.',
        shortDescription: 'Essential PC-friendly interface overhaul',
        price: 0,
        isFree: true,
        category: 'UI/UX',
        gameTitle: 'Skyrim',
        author: 'SkyUI Team',
        images: ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=250&fit=crop&auto=format'],
        version: '5.2',
        rating: 4.9,
        downloads: 85000000,
        featured: true,
        status: 'finalised',
        tags: ['ui', 'interface', 'inventory', 'essential'],
        requirements: 'Skyrim Special Edition, SKSE64',
        specs: 'Any system capable of running Skyrim'
    },
    {
        _id: 'enb',
        title: 'ENB Series',
        description: 'ENB Series is a comprehensive graphics modification that enhances Skyrim with advanced lighting, shadows, and post-processing effects for stunning visual improvements.',
        shortDescription: 'Advanced graphics enhancement suite',
        price: 12.99,
        isFree: false,
        category: 'Graphics',
        gameTitle: 'Skyrim',
        author: 'Boris Vorontsov',
        images: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=250&fit=crop&auto=format'],
        version: '0.487',
        rating: 4.7,
        downloads: 15000000,
        featured: false,
        status: 'finalised',
        tags: ['graphics', 'lighting', 'shaders', 'visual'],
        requirements: 'Skyrim Special Edition, DirectX 11',
        specs: 'GTX 1060 or better, 8GB RAM minimum'
    },
    {
        _id: 'fabric',
        title: 'Fabric API',
        description: 'Essential hooks for modding with Fabric. Fabric API is the library for essential hooks and interoperability mechanisms for Fabric mods.',
        shortDescription: 'Essential library for Fabric mods',
        price: 0,
        isFree: true,
        category: 'Utility',
        gameTitle: 'Minecraft',
        author: 'FabricMC',
        images: ['https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=400&h=250&fit=crop&auto=format'],
        version: '0.92.2',
        rating: 4.8,
        downloads: 120000000,
        featured: false,
        status: 'finalised',
        tags: ['api', 'library', 'fabric', 'essential'],
        requirements: 'Minecraft 1.20+, Fabric Loader',
        specs: 'Minimum: 2GB RAM'
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('ExusCraft loading...');
    
    initializeTheme();
    
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        setTimeout(() => {
            loadingElement.style.display = 'none';
        }, 500);
    }
    
    loadSavedData();
    
    // Load mods
    mods = realMods;
    displayModsInSections(mods);
    
    initScrollAnimations();
    initNavbarScroll();
    updateUserNavigation();
    updateCartDisplay();
    
    console.log('ExusCraft loaded successfully!');
});

// Theme System
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    showMessage(`Switched to ${currentTheme} mode`, 'success');
}

function updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Data Management
function loadSavedData() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        } catch (e) {
            cart = [];
        }
    }
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateUserNavigation();
        } catch (e) {
            localStorage.removeItem('user');
        }
    }
}

function saveData() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// User Navigation
function updateUserNavigation() {
    const navUser = document.getElementById('navUser');
    const navAuth = document.getElementById('navAuth');
    const username = document.getElementById('username');
    const userAvatar = document.getElementById('userAvatar');
    
    if (currentUser) {
        if (navUser) navUser.style.display = 'flex';
        if (navAuth) navAuth.style.display = 'none';
        if (username) username.textContent = currentUser.name || currentUser.username || currentUser.email || 'User';
        
        if (userAvatar) {
            if (currentUser.picture || currentUser.avatar) {
                userAvatar.src = currentUser.picture || currentUser.avatar;
            } else {
                const firstLetter = (currentUser.name || currentUser.username || 'U')[0].toUpperCase();
                userAvatar.src = `https://via.placeholder.com/32x32/ff6b6b/ffffff?text=${firstLetter}`;
            }
        }
    } else {
        if (navUser) navUser.style.display = 'none';
        if (navAuth) navAuth.style.display = 'flex';
    }
}

// Authentication
function showLogin() {
    document.getElementById('authContent').innerHTML = `
        <div class="auth-form">
            <div class="auth-header">
                <h2>Welcome Back</h2>
                <p>Sign in to your ExusCraft account</p>
            </div>
            
            <div id="googleSignInDiv" style="display: flex; justify-content: center; margin: 1.5rem 0;"></div>
            
            <div class="auth-footer">
                Don't have an account? <a href="#" onclick="showRegister()">Join ExusCraft</a>
            </div>
        </div>
    `;
    document.getElementById('authModal').style.display = 'block';
    
    setTimeout(() => {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.renderButton(
                document.getElementById('googleSignInDiv'),
                { theme: 'filled_blue', size: 'large', text: 'signin_with', shape: 'rectangular', width: 280 }
            );
        }
    }, 100);
}

function showRegister() { showLogin(); }
function loginWithGoogle() { showLogin(); }

// Initialize Google Sign-In
function initGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: '125508254360-rdb0cu5l4b2majds3i6pa13663uchku0.apps.googleusercontent.com',
            callback: handleGoogleCredentialResponse
        });
    }
}

setTimeout(initGoogleSignIn, 500);

function handleGoogleCredentialResponse(response) {
    try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        currentUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        };
        
        localStorage.setItem('user', JSON.stringify(currentUser));
        updateUserNavigation();
        closeAuthModal();
        showMessage(`Welcome, ${currentUser.name}! 🎉`, 'success');
    } catch (error) {
        console.error('Error processing Google response:', error);
        showMessage('Google login failed. Please try again.', 'error');
    }
}

function logout() {
    localStorage.removeItem('user');
    currentUser = null;
    updateUserNavigation();
    showMessage('Logged out successfully!', 'success');
}

function toggleUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('show');
    }
}

function showProfile() { showMessage('Profile feature coming soon!', 'info'); }
function showOrders() { showMessage('Orders feature coming soon!', 'info'); }
function showSettings() { showMessage('Settings feature coming soon!', 'info'); }

// Display Mods in Sections
function displayModsInSections(modsToShow) {
    const featuredMods = modsToShow.filter(mod => mod.featured).slice(0, 4);
    displayModCards(featuredMods, 'featuredGames');
    
    const newMods = [...modsToShow].sort((a, b) => b.downloads - a.downloads).slice(0, 6);
    displayModCards(newMods, 'newReleases');
    
    const freeMods = modsToShow.filter(mod => mod.isFree).slice(0, 6);
    displayModCards(freeMods, 'dealsGames');
    
    displayModCards(modsToShow, 'allGames');
    
    // Ensure all cards are visible and clickable
    setTimeout(() => {
        document.querySelectorAll('.mod-card, .game-card').forEach(card => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.display = 'block';
            card.style.transform = 'translateY(0)';
            card.style.pointerEvents = 'auto';
            card.style.cursor = 'pointer';
        });
    }, 100);
}

function displayModCards(modsToShow, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = modsToShow.map((mod) => {
        const stars = '★'.repeat(Math.floor(mod.rating || 4)) + '☆'.repeat(5 - Math.floor(mod.rating || 4));
        const priceDisplay = mod.isFree ? 'FREE' : '$' + mod.price.toFixed(2);
        
        const statusConfig = {
            'in-progress': { color: '#f59e0b', label: 'In Progress' },
            'finalised': { color: '#10b981', label: 'Finalised' },
            'bug-tested': { color: '#3b82f6', label: 'Bug Tested' },
            'beta': { color: '#8b5cf6', label: 'Beta' },
            'starting-out': { color: '#ef4444', label: 'Starting Out' }
        };
        const status = statusConfig[mod.status];
        
        return `
            <div class="mod-card" onclick="showModDetails('${mod._id}')" style="cursor: pointer; opacity: 1; visibility: visible; pointer-events: auto;">
                <div class="mod-card-image">
                    <img src="${mod.images[0]}" alt="${mod.title}" onerror="this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'">
                    ${mod.featured ? '<span class="mod-badge featured">Featured</span>' : ''}
                    ${mod.isFree ? '<span class="mod-badge free">FREE</span>' : ''}
                    ${status ? `<span class="mod-badge status" style="background: ${status.color}">${status.label}</span>` : ''}
                </div>
                <div class="mod-card-content">
                    <h3 class="mod-card-title">${mod.title}</h3>
                    <p class="mod-card-desc">${mod.shortDescription}</p>
                    <div class="mod-card-meta">
                        <span class="mod-card-game"><i class="fas fa-gamepad"></i> ${mod.gameTitle}</span>
                        <span class="mod-card-category">${mod.category}</span>
                    </div>
                    <div class="mod-card-stats">
                        <span class="mod-card-rating"><span class="stars">${stars}</span> ${mod.rating.toFixed(1)}</span>
                        <span class="mod-card-downloads"><i class="fas fa-download"></i> ${formatDownloads(mod.downloads)}</span>
                    </div>
                    <div class="mod-card-footer">
                        <span class="mod-card-price">${priceDisplay}</span>
                        <span class="mod-card-author">by ${mod.author}</span>
                    </div>
                    <div class="mod-card-actions">
                        <button onclick="event.stopPropagation(); ${mod.isFree ? `downloadMod('${mod._id}')` : `addModToCart('${mod._id}')`}" class="btn btn-primary btn-sm">
                            <i class="fas fa-${mod.isFree ? 'download' : 'cart-plus'}"></i>
                            ${mod.isFree ? 'Download' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Force visibility and clickability
    setTimeout(() => {
        container.querySelectorAll('.mod-card').forEach(card => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.display = 'block';
            card.style.pointerEvents = 'auto';
            card.style.cursor = 'pointer';
        });
    }, 50);
}

function formatDownloads(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Show Mod Details Modal with Animation
function showModDetails(modId) {
    const mod = mods.find(m => m._id === modId);
    if (!mod) return;
    
    const modal = document.getElementById('gameModal');
    const gameDetails = document.getElementById('gameDetails');
    if (!modal || !gameDetails) return;
    
    const stars = '★'.repeat(Math.floor(mod.rating || 4)) + '☆'.repeat(5 - Math.floor(mod.rating || 4));
    const priceDisplay = mod.isFree ? 'FREE' : '$' + mod.price.toFixed(2);
    
    const statusConfig = {
        'in-progress': { color: '#f59e0b', label: 'In Progress', icon: '🔧' },
        'finalised': { color: '#10b981', label: 'Finalised', icon: '✅' },
        'bug-tested': { color: '#3b82f6', label: 'Bug Tested', icon: '🐛' },
        'beta': { color: '#8b5cf6', label: 'Beta', icon: '🧪' },
        'starting-out': { color: '#ef4444', label: 'Starting Out', icon: '🌱' }
    };
    const status = statusConfig[mod.status];
    
    // Generate fake reviews
    const reviews = [
        { user: 'ModLover123', rating: 5, comment: 'Amazing mod! Works perfectly and great performance boost.' },
        { user: 'GamerPro', rating: 4, comment: 'Really good, had some minor issues but overall excellent.' },
        { user: 'TechUser', rating: 5, comment: 'Essential mod for anyone playing this game. Highly recommended!' }
    ];
    
    gameDetails.innerHTML = `
        <div class="mod-detail">
            <div class="mod-detail-header">
                <img src="${mod.images[0]}" alt="${mod.title}" class="mod-detail-image" onerror="this.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop'">
                <div class="mod-detail-info">
                    <h2>${mod.title}</h2>
                    ${status ? `<span class="status-pill" style="background: ${status.color}">${status.icon} ${status.label}</span>` : ''}
                    <div class="mod-detail-meta">
                        <span><i class="fas fa-gamepad"></i> ${mod.gameTitle}</span>
                        <span><i class="fas fa-tag"></i> ${mod.category}</span>
                        <span><i class="fas fa-code-branch"></i> v${mod.version}</span>
                    </div>
                    <div class="mod-detail-author">by <strong>${mod.author}</strong></div>
                    <div class="mod-detail-rating">
                        <span class="stars">${stars}</span>
                        <span>${mod.rating.toFixed(1)} / 5.0</span>
                        <span class="downloads"><i class="fas fa-download"></i> ${formatDownloads(mod.downloads)} downloads</span>
                    </div>
                </div>
            </div>
            
            <div class="mod-detail-section">
                <h3>Description</h3>
                <p>${mod.description}</p>
            </div>
            
            <div class="mod-detail-section">
                <h3>System Requirements</h3>
                <p><strong>Requirements:</strong> ${mod.requirements}</p>
                <p><strong>Recommended Specs:</strong> ${mod.specs}</p>
            </div>
            
            ${mod.tags && mod.tags.length > 0 ? `
            <div class="mod-detail-section">
                <h3>Tags</h3>
                <div class="tags-list">
                    ${mod.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="mod-detail-section">
                <h3>Reviews (${reviews.length})</h3>
                <div class="reviews-list">
                    ${reviews.map(review => `
                        <div class="review-item">
                            <div class="review-header">
                                <strong>${review.user}</strong>
                                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                            </div>
                            <p class="review-comment">${review.comment}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="mod-detail-price-section">
                <span class="price-label">${mod.isFree ? 'Free Download' : 'Price'}</span>
                <span class="price-value">${priceDisplay}</span>
            </div>
            
            <div class="mod-detail-actions">
                ${mod.isFree ? `
                    <button onclick="downloadModWithAnimation('${mod._id}')" class="btn btn-primary btn-large download-btn" id="downloadBtn-${mod._id}">
                        <i class="fas fa-download"></i> Download Now
                    </button>
                ` : `
                    <button onclick="purchaseMod('${mod._id}')" class="btn btn-primary btn-large">
                        <i class="fas fa-credit-card"></i> Purchase - ${priceDisplay}
                    </button>
                    <button onclick="addModToCart('${mod._id}')" class="btn btn-outline btn-large">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                `}
            </div>
        </div>
    `;
    
    // Add modal opening animation
    modal.style.display = 'block';
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        modal.style.transition = 'all 0.3s ease';
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
}

// Download Mod with Animation (ALWAYS DIRECT DOWNLOAD)
function downloadModWithAnimation(modId) {
    const mod = mods.find(m => m._id === modId);
    if (!mod) {
        showMessage('Mod not found!', 'error');
        return;
    }
    
    const downloadBtn = document.getElementById(`downloadBtn-${modId}`);
    if (downloadBtn) {
        // Animate button
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
        downloadBtn.disabled = true;
        downloadBtn.style.background = '#6b7280';
    }
    
    showMessage(`Preparing download for ${mod.title}...`, 'info');
    
    setTimeout(() => {
        if (downloadBtn) {
            downloadBtn.innerHTML = '<i class="fas fa-download fa-bounce"></i> Downloading...';
            downloadBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }
        
        // Create downloadable file (ALWAYS DIRECT DOWNLOAD)
        const content = `===========================================
${mod.title} - v${mod.version}
===========================================

Author: ${mod.author}
Category: ${mod.category}
Game: ${mod.gameTitle}
Rating: ${mod.rating}/5.0
Downloads: ${formatDownloads(mod.downloads)}

Description:
${mod.description}

System Requirements:
${mod.requirements}

Recommended Specs:
${mod.specs}

Tags: ${mod.tags ? mod.tags.join(', ') : 'N/A'}

Installation Instructions:
1. Extract the downloaded files
2. Copy to your game's mod directory
3. Enable the mod in your game settings
4. Restart the game and enjoy!

===========================================
Thank you for downloading from ExusCraft!
Proudly made in New Zealand 🇳🇿
===========================================`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${mod.title.replace(/[^a-z0-9]/gi, '_')}_v${mod.version}_ExusCraft.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        if (downloadBtn) {
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
            downloadBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }
        
        showMessage(`${mod.title} downloaded successfully!`, 'success');
        
        setTimeout(() => {
            closeModal();
        }, 1500);
        
    }, 1000);
}

// Download Mod (for card buttons)
function downloadMod(modId) {
    downloadModWithAnimation(modId);
}

// Purchase Mod
function purchaseMod(modId) {
    const mod = mods.find(m => m._id === modId);
    if (!mod) {
        showMessage('Mod not found!', 'error');
        return;
    }
    
    if (!currentUser) {
        showMessage('Please login to purchase mods', 'info');
        closeModal();
        showLogin();
        return;
    }
    
    const confirmPurchase = confirm(`Purchase ${mod.title} for $${mod.price.toFixed(2)}?\n\nThis is a demo - no real payment will be processed.`);
    
    if (confirmPurchase) {
        showMessage(`Processing purchase for ${mod.title}...`, 'info');
        
        setTimeout(() => {
            showMessage(`🎉 Purchase successful! ${mod.title} is now yours!`, 'success');
            closeModal();
            setTimeout(() => downloadMod(modId), 1000);
        }, 1500);
    }
}

// Add to Cart
function addModToCart(modId) {
    const mod = mods.find(m => m._id === modId);
    if (!mod) {
        showMessage('Mod not found!', 'error');
        return;
    }
    
    if (cart.find(item => item._id === modId)) {
        showMessage(`${mod.title} is already in cart!`, 'info');
        return;
    }
    
    cart.push(mod);
    updateCartDisplay();
    saveData();
    showMessage(`${mod.title} added to cart!`, 'success');
}

function removeFromCart(modId) {
    cart = cart.filter(item => item._id !== modId);
    updateCartDisplay();
    saveData();
    showMessage('Item removed from cart', 'info');
}

// Cart Display
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
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <span>Add some amazing mods to get started!</span>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.images[0]}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/60x60'">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <button onclick="removeFromCart('${item._id}')" class="cart-item-remove">
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
    if (cartElement) {
        cartElement.classList.toggle('open');
        if (cartElement.classList.contains('open')) {
            updateCartDisplay();
        }
    }
}

function checkout() {
    if (!currentUser) {
        showLogin();
        showMessage('Please login to checkout', 'error');
        return;
    }
    if (cart.length === 0) {
        showMessage('Your cart is empty!', 'info');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const confirmCheckout = confirm(`Complete purchase for $${total.toFixed(2)}?\n\nThis is a demo - no real payment will be processed.`);
    
    if (confirmCheckout) {
        showMessage('Processing your order...', 'info');
        setTimeout(() => {
            cart.forEach(item => downloadMod(item._id));
            cart = [];
            updateCartDisplay();
            saveData();
            toggleCart();
            showMessage('🎉 Purchase complete! Your mods are downloading.', 'success');
        }, 1500);
    }
}

// Search and Filter Functions (NO SIDEBAR)
function searchAllMods() {
    const searchInput = document.getElementById('gameSearch');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayModCards(mods, 'allGames');
        return;
    }
    
    const filtered = mods.filter(mod => 
        mod.title.toLowerCase().includes(searchTerm) ||
        mod.description.toLowerCase().includes(searchTerm) ||
        mod.gameTitle.toLowerCase().includes(searchTerm) ||
        mod.category.toLowerCase().includes(searchTerm) ||
        mod.author.toLowerCase().includes(searchTerm) ||
        (mod.tags && mod.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
    
    displayModCards(filtered, 'allGames');
    
    if (filtered.length === 0) {
        document.getElementById('allGames').innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No mods found for "${searchTerm}"</p>
                <span>Try a different search term</span>
            </div>
        `;
    }
}

function filterAllMods() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter || !categoryFilter.value) {
        displayModCards(mods, 'allGames');
        return;
    }
    
    const filtered = mods.filter(mod => mod.category === categoryFilter.value);
    displayModCards(filtered, 'allGames');
}

function filterByGame(game) {
    const filtered = mods.filter(mod => mod.gameTitle === game);
    displayModCards(filtered, 'allGames');
    
    const modsSection = document.getElementById('games');
    if (modsSection) {
        modsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showMessage(`Showing mods for ${game}`, 'info');
}

function filterByGameAdvanced() {
    const gameFilter = document.getElementById('gameFilter');
    if (gameFilter && gameFilter.value) {
        filterByGame(gameFilter.value);
    } else {
        displayModCards(mods, 'allGames');
    }
}

function sortMods() {
    const sortFilter = document.getElementById('sortFilter');
    if (!sortFilter) return;
    
    let sorted = [...mods];
    
    switch (sortFilter.value) {
        case 'newest':
            sorted.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'popular':
            sorted.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
    }
    
    displayModCards(sorted, 'allGames');
}

function loadMoreMods() {
    showMessage('All mods are already loaded!', 'info');
}

// Utility Functions
function showMessage(message, type) {
    document.querySelectorAll('.toast-message').forEach(el => el.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'toast-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 100000;
        max-width: 350px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
}

function closeModal() {
    const modal = document.getElementById('gameModal');
    if (modal) modal.style.display = 'none';
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.style.display = 'none';
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    ['authModal', 'profileModal', 'gameModal'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Close user dropdown
    if (!e.target.closest('.user-profile-dropdown')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
    
    // Close game dropdown
    if (!e.target.closest('.nav-dropdown')) {
        const dropdown = document.getElementById('gameDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
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
    
    document.querySelectorAll('.fade-in, .section-header').forEach(el => {
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
        if (chatbot.classList.contains('open') && notification) {
            notification.style.display = 'none';
        }
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim()) return;
    
    const message = input.value.trim();
    input.value = '';
    
    addMessageToChat(message, 'user');
    
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessageToChat(response, 'bot');
    }, 800);
}

function askBot(question) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = question;
        sendMessage();
    }
}

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
        </div>
        <div class="message-content">${message}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(message) {
    const lower = message.toLowerCase();
    
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return "Hello! I'm ExusBot 🤖 How can I help you today?";
    }
    if (lower.includes('mod') && lower.includes('install')) {
        return "To install mods: 1) Download the mod file 2) Extract to your game's mod folder 3) Enable in game settings 4) Restart the game. Need help with a specific game?";
    }
    if (lower.includes('download')) {
        return "Click on any mod card to see details, then click 'Download Now' for free mods or 'Purchase' for paid ones. Downloads go straight to your PC!";
    }
    if (lower.includes('price') || lower.includes('cost') || lower.includes('free')) {
        return "We have both free and paid mods! Free mods are marked with a 'FREE' badge. Paid mods support the creators who make them.";
    }
    
    return "I can help with mod installation, downloads, and general questions. What would you like to know?";
}

// Navigation helpers
function checkLoginAndNavigate(section) {
    const modsSection = document.getElementById('games');
    if (modsSection) {
        modsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function checkLoginAndExplore() {
    const modsSection = document.getElementById('games');
    if (modsSection) {
        modsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleGameDropdown() {
    const dropdown = document.getElementById('gameDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Make all functions globally available
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
window.toggleChatbot = toggleChatbot;
window.closeAuthModal = closeAuthModal;
window.closeModal = closeModal;
window.closeProfileModal = closeProfileModal;
window.showModDetails = showModDetails;
window.downloadMod = downloadMod;
window.purchaseMod = purchaseMod;
window.addModToCart = addModToCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.searchAllMods = searchAllMods;
window.filterAllMods = filterAllMods;
window.filterByGame = filterByGame;
window.filterByGameAdvanced = filterByGameAdvanced;
window.sortMods = sortMods;
window.loadMoreMods = loadMoreMods;
window.checkLoginAndNavigate = checkLoginAndNavigate;
window.checkLoginAndExplore = checkLoginAndExplore;
window.toggleGameDropdown = toggleGameDropdown;
window.handleChatKeyPress = handleChatKeyPress;
window.sendMessage = sendMessage;
window.askBot = askBot;
window.handleGoogleCredentialResponse = handleGoogleCredentialResponse;

console.log('ExusCraft app loaded successfully!');