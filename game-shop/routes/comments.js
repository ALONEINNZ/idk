const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Mod = require('../models/Mod');
const auth = require('../middleware/auth');

// Get comments for a mod
router.get('/mod/:modId', async (req, res) => {
    try {
        const { modId } = req.params;
        const { page = 1, limit = 20, sort = 'newest' } = req.query;
        
        let sortOption = {};
        switch (sort) {
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'likes':
                sortOption = { likeCount: -1, createdAt: -1 };
                break;
            default:
                sortOption = { isPinned: -1, createdAt: -1 };
        }
        
        const comments = await Comment.find({ 
            modId, 
            parentId: null,
            isDeleted: false 
        })
        .populate('replies', 'content username userAvatar likeCount createdAt')
        .sort(sortOption)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();
        
        const total = await Comment.countDocuments({ 
            modId, 
            parentId: null,
            isDeleted: false 
        });
        
        res.json({
            comments,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Post a new comment
router.post('/mod/:modId', auth, async (req, res) => {
    try {
        const { modId } = req.params;
        const { content, parentId } = req.body;
        
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Comment content is required' });
        }
        
        // Verify mod exists
        const mod = await Mod.findById(modId);
        if (!mod) {
            return res.status(404).json({ error: 'Mod not found' });
        }
        
        // If replying to a comment, verify parent exists
        if (parentId) {
            const parentComment = await Comment.findById(parentId);
            if (!parentComment) {
                return res.status(404).json({ error: 'Parent comment not found' });
            }
        }
        
        const comment = new Comment({
            modId,
            userId: req.user.id,
            username: req.user.username,
            userAvatar: req.user.avatar || '/images/default-avatar.png',
            content: content.trim(),
            parentId: parentId || null
        });
        
        await comment.save();
        
        // If this is a reply, add it to parent's replies array
        if (parentId) {
            await Comment.findByIdAndUpdate(parentId, {
                $push: { replies: comment._id }
            });
        }
        
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ error: 'Failed to post comment' });
    }
});

// Like/unlike a comment
router.post('/:commentId/like', auth, async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        const existingLike = comment.likes.find(like => 
            like.userId.toString() === userId
        );
        
        if (existingLike) {
            // Unlike
            comment.likes = comment.likes.filter(like => 
                like.userId.toString() !== userId
            );
            comment.likeCount = Math.max(0, comment.likeCount - 1);
        } else {
            // Like
            comment.likes.push({ userId });
            comment.likeCount += 1;
        }
        
        await comment.save();
        
        res.json({ 
            liked: !existingLike,
            likeCount: comment.likeCount 
        });
    } catch (error) {
        console.error('Error toggling comment like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

// Edit a comment
router.put('/:commentId', auth, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Comment content is required' });
        }
        
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Not authorized to edit this comment' });
        }
        
        // Save edit history
        comment.editHistory.push({
            content: comment.content,
            editedAt: new Date()
        });
        
        comment.content = content.trim();
        comment.isEdited = true;
        
        await comment.save();
        
        res.json(comment);
    } catch (error) {
        console.error('Error editing comment:', error);
        res.status(500).json({ error: 'Failed to edit comment' });
    }
});

// Delete a comment
router.delete('/:commentId', auth, async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this comment' });
        }
        
        comment.isDeleted = true;
        comment.deletedAt = new Date();
        comment.content = '[Comment deleted]';
        
        await comment.save();
        
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

// Report a comment
router.post('/:commentId/report', auth, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { reason, description } = req.body;
        const userId = req.user.id;
        
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        // Check if user already reported this comment
        const existingReport = comment.reports.find(report => 
            report.userId.toString() === userId
        );
        
        if (existingReport) {
            return res.status(400).json({ error: 'You have already reported this comment' });
        }
        
        comment.reports.push({
            userId,
            reason,
            description,
            reportedAt: new Date()
        });
        
        comment.isReported = true;
        
        await comment.save();
        
        res.json({ message: 'Comment reported successfully' });
    } catch (error) {
        console.error('Error reporting comment:', error);
        res.status(500).json({ error: 'Failed to report comment' });
    }
});

module.exports = router;