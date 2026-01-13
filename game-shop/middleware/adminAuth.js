const adminAuth = (req, res, next) => {
    // Check if user is authenticated first
    if (!req.user) {
        return res.status(401).json({ error: 'Access denied. Authentication required.' });
    }
    
    // Check if user is admin
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    next();
};

module.exports = adminAuth;