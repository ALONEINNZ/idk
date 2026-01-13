// Admin panel functionality
let currentUser = null;
const API_BASE = window.location.origin + '/api';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadMods();
    loadAnalytics();
});

// Check admin authentication
async function checkAdminAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            if (currentUser.role !== 'admin') {
                alert('Access denied. Admin privileges required.');
                window.location.href = '/';
                return;
            }
            document.getElementById('adminUsername').textContent = currentUser.username;
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/';
    }
}

// Tab management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'manage') {
        loadMods();
    } else if (tabName === 'users') {
        loadUsers();
    } else if (tabName === 'analytics') {
        loadAnalytics();
    }
}

// Upload mod
async function uploadMod(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('modTitle').value);
    formData.append('author', document.getElementById('modAuthor').value);
    formData.append('gameTitle', document.getElementById('gameTitle').value);
    formData.append('category', document.getElementById('modCategory').value);
    formData.append('gameEngine', document.getElementById('gameEngine').value);
    formData.append('price', document.getElementById('modPrice').value);
    formData.append('shortDescription', document.getElementById('shortDescription').value);
    formData.append('description', document.getElementById('fullDescription').value);
    formData.append('tags', document.getElementById('modTags').value);
    
    // Add images
    const images = document.getElementById('modImages').files;
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }
    
    // Add mod file
    const modFile = document.getElementById('modFile').files[0];
    if (modFile) {
        formData.append('modFile', modFile);
    }
    
    try {
        const response = await fetch(`${API_BASE}/mods/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Mod uploaded successfully!', 'success');
            document.getElementById('modUploadForm').reset();
            loadMods();
        } else {
            showMessage(result.message || 'Upload failed', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showMessage('Upload failed. Please try again.', 'error');
    }
}

// Load mods for management
async function loadMods() {
    try {
        const response = await fetch(`${API_BASE}/mods/admin`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const mods = await response.json();
            displayMods(mods);
        }
    } catch (error) {
        console.error('Error loading mods:', error);
    }
}

// Display mods in management panel
function displayMods(mods) {
    const container = document.getElementById('modsList');
    
    if (mods.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No mods uploaded yet.</p>';
        return;
    }
    
    container.innerHTML = mods.map(mod => `
        <div class="mod-item">
            <img src="${mod.images[0] || '/placeholder.jpg'}" alt="${mod.title}" 
                 style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--border-radius);">
            
            <div class="mod-info">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary);">${mod.title}</h4>
                <p style="margin: 0 0 0.5rem 0; color: var(--text-secondary); font-size: 0.9rem;">${mod.shortDescription}</p>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <span class="status-badge status-${mod.approved ? 'approved' : 'pending'}">
                        ${mod.approved ? 'Approved' : 'Pending'}
                    </span>
                    <span style="color: var(--text-muted); font-size: 0.8rem;">
                        ${mod.downloads} downloads • $${mod.price}
                    </span>
                </div>
            </div>
            
            <div class="mod-actions">
                ${!mod.approved ? `
                    <button onclick="approveMod('${mod._id}')" class="btn btn-primary" style="padding: 0.5rem 1rem;">
                        <i class="fas fa-check"></i> Approve
                    </button>
                ` : ''}
                <button onclick="toggleFeatured('${mod._id}', ${mod.featured})" class="btn btn-outline" style="padding: 0.5rem 1rem;">
                    <i class="fas fa-star"></i> ${mod.featured ? 'Unfeature' : 'Feature'}
                </button>
                <button onclick="deleteMod('${mod._id}')" class="btn btn-outline" style="padding: 0.5rem 1rem; color: #dc3545; border-color: #dc3545;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Approve mod
async function approveMod(modId) {
    try {
        const response = await fetch(`${API_BASE}/mods/${modId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            showMessage('Mod approved successfully!', 'success');
            loadMods();
        }
    } catch (error) {
        console.error('Error approving mod:', error);
        showMessage('Failed to approve mod', 'error');
    }
}

// Toggle featured status
async function toggleFeatured(modId, currentStatus) {
    try {
        const response = await fetch(`${API_BASE}/mods/${modId}/feature`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ featured: !currentStatus })
        });
        
        if (response.ok) {
            showMessage('Featured status updated!', 'success');
            loadMods();
        }
    } catch (error) {
        console.error('Error updating featured status:', error);
        showMessage('Failed to update featured status', 'error');
    }
}

// Delete mod
async function deleteMod(modId) {
    if (!confirm('Are you sure you want to delete this mod?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/mods/${modId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            showMessage('Mod deleted successfully!', 'success');
            loadMods();
        }
    } catch (error) {
        console.error('Error deleting mod:', error);
        showMessage('Failed to delete mod', 'error');
    }
}

// Load users
async function loadUsers() {
    // Implementation for user management
    document.getElementById('usersList').innerHTML = '<p>User management coming soon...</p>';
}

// Load analytics
async function loadAnalytics() {
    try {
        const response = await fetch(`${API_BASE}/admin/analytics`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const analytics = await response.json();
            document.getElementById('totalMods').textContent = analytics.totalMods || 0;
            document.getElementById('totalDownloads').textContent = analytics.totalDownloads || 0;
            document.getElementById('activeUsers').textContent = analytics.activeUsers || 0;
            document.getElementById('totalRevenue').textContent = `$${analytics.totalRevenue || 0}`;
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

// Show message
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