const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// Get all comments
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate('author', 'username')
            .populate('post', 'title')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', ['username', 'profilePicture'])
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create comment
router.post('/', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.body.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = new Comment({
            content: req.body.content,
            author: req.user.id,
            post: req.body.postId
        });

        const comment = await newComment.save();
        await comment.populate('author', ['username', 'profilePicture']);

        // Add comment to post's comments array
        post.comments.push(comment._id);
        await post.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update comment
router.put('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this comment' });
        }

        comment.content = req.body.content;
        await comment.save();
        await comment.populate('author', ['username', 'profilePicture']);

        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete comment
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Remove comment from post's comments array
        const post = await Post.findById(comment.post);
        if (post) {
            post.comments = post.comments.filter(
                commentId => commentId.toString() !== comment._id.toString()
            );
            await post.save();
        }

        await comment.remove();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
