// Profile page functionality
let currentProfile = null;
let currentUserId = null;
let isOwnProfile = false;

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    // Get user ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentUserId = urlParams.get('userId');
    
    // If no userId specified, try to load current user's profile
    if (!currentUserId && currentUser) {
        currentUserId = currentUser._id;
        // Update URL without refreshing
        window.history.replaceState({}, '',