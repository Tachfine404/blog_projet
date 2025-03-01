const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Post = require('../models/Post');
const { protect, admin } = require('../middleware/auth');

// Get all categories with post count
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const postCount = await Post.countDocuments({ category: category._id });
                return {
                    _id: category._id,
                    title: category.title,
                    postCount
                };
            })
        );
        res.json(categoriesWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get posts by category
router.get('/:id/posts', async (req, res) => {
    try {
        const posts = await Post.find({ category: req.params.id })
            .populate('author', 'username')
            .populate('category', 'title')
            .sort('-createdAt');

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create category (admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        // Check if category with same title already exists
        const existingCategory = await Category.findOne({ 
            title: { $regex: new RegExp(`^${req.body.title}$`, 'i') }
        });
        
        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this title already exists' });
        }

        const newCategory = new Category({
            title: req.body.title
        });

        const category = await newCategory.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update category (admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if another category with same title exists
        const existingCategory = await Category.findOne({
            _id: { $ne: req.params.id },
            title: { $regex: new RegExp(`^${req.body.title}$`, 'i') }
        });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this title already exists' });
        }

        category.title = req.body.title;
        await category.save();
        
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete category (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        // Check if category has posts
        const postsCount = await Post.countDocuments({ category: req.params.id });
        if (postsCount > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete category that has posts' 
            });
        }

        const result = await Category.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
