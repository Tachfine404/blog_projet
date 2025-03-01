const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const Like = require('../models/Like');
const { protect, admin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all posts with stats (admin only)
router.get('/posts', protect, admin, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username profilePicture')
            .populate('category', 'title')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' }
            });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all comments (admin only)
router.get('/comments', protect, admin, async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate('author', 'username')
            .populate('post', 'title');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all categories with post count (admin only)
router.get('/categories', protect, admin, async (req, res) => {
    try {
        const categories = await Category.find();
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const postCount = await Post.countDocuments({ category: category._id });
                return {
                    ...category.toObject(),
                    postCount
                };
            })
        );
        res.json(categoriesWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create category (admin only)
router.post('/categories', protect, admin, async (req, res) => {
    try {
        const category = new Category({
            title: req.body.name
        });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update category (admin only)
router.put('/categories/:id', protect, admin, async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { title: req.body.name },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete category (admin only)
router.delete('/categories/:id', protect, admin, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // Optionally, update posts that had this category
        await Post.updateMany(
            { category: req.params.id },
            { $unset: { category: "" } }
        );
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get dashboard stats (admin only)
router.get('/stats', protect, admin, async (req, res) => {
    try {
        // Get counts
        const [usersCount, postsCount, commentsCount, categoriesCount] = await Promise.all([
            User.countDocuments(),
            Post.countDocuments(),
            Comment.countDocuments(),
            Category.countDocuments()
        ]);

        // Get recent items
        const [recentUsers, recentPosts, recentComments] = await Promise.all([
            User.find()
                .select('username profilePicture createdAt')
                .sort('-createdAt')
                .limit(5),
            Post.find()
                .populate('author', 'username')
                .select('title author createdAt')
                .sort('-createdAt')
                .limit(5),
            Comment.find()
                .populate('author', 'username profilePicture')
                .populate('post', 'title')
                .select('content author post createdAt')
                .sort('-createdAt')
                .limit(5)
        ]);

        res.json({
            counts: {
                users: usersCount,
                posts: postsCount,
                comments: commentsCount,
                categories: categoriesCount
            },
            recent: {
                users: recentUsers,
                posts: recentPosts,
                comments: recentComments
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user (admin only)
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete post (admin only)
router.delete('/posts/:id', protect, admin, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete comment (admin only)
router.delete('/comments/:id', protect, admin, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user role (admin only)
router.patch('/users/:id/role', protect, admin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
