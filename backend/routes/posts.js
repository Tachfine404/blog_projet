const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const { protect, admin } = require('../middleware/auth');

// Configure multer for file uploads
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/posts');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .populate('category', 'title')
            .sort('-createdAt');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's posts
router.get('/user', protect, async (req, res) => {
    try {
        console.log('Fetching posts for user:', req.user._id);
        const posts = await Post.find({ author: req.user._id })
            .populate('author', 'username profilePicture')
            .populate('category', 'title')
            .sort('-createdAt');
        
        console.log('Found posts:', posts.length);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des posts' });
    }
});

// Get user posts
router.get('/user/:userId', protect, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'username')
            .populate('category', 'title')
            .sort('-createdAt');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get posts by category
router.get('/category/:id', async (req, res) => {
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

// Get single post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('category', 'title');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create post
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            image: req.file ? `/uploads/posts/${req.file.filename}` : null,
            category: req.body.category,
            author: req.user._id
        });

        const post = await newPost.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update post
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns the post or is admin
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        
        // Handle image update
        if (req.file) {
            post.image = `/uploads/posts/${req.file.filename}`;
        } else if (req.body.removeImage === 'true') {
            post.image = null;
        }
        
        // Handle category update - expect category ID
        if (req.body.category) {
            post.category = req.body.category;
        }

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete post
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns the post or is admin
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await Post.deleteOne({ _id: req.params.id });
        
        // Also delete associated likes and comments
        await Promise.all([
            Like.deleteMany({ post: req.params.id }),
            Comment.deleteMany({ post: req.params.id })
        ]);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get post likes
router.get('/:id/likes', async (req, res) => {
    try {
        const likes = await Like.find({ post: req.params.id })
            .populate('user', 'username profilePicture');
        res.json(likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get like status for a post
router.get('/:id/likes/status', protect, async (req, res) => {
    try {
        const like = await Like.findOne({
            post: req.params.id,
            user: req.user._id
        });
        res.json({ liked: !!like });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Like a post
router.post('/:id/likes', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const existingLike = await Like.findOne({
            post: req.params.id,
            user: req.user._id
        });

        if (existingLike) {
            return res.status(400).json({ message: 'Post already liked' });
        }

        const like = new Like({
            post: req.params.id,
            user: req.user._id
        });

        await like.save();
        post.likes = (post.likes || 0) + 1;
        await post.save();

        res.status(201).json({ message: 'Post liked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Unlike a post
router.delete('/:id/likes', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const like = await Like.findOneAndDelete({
            post: req.params.id,
            user: req.user._id
        });

        if (!like) {
            return res.status(400).json({ message: 'Post not liked yet' });
        }

        post.likes = Math.max((post.likes || 1) - 1, 0);
        await post.save();

        res.json({ message: 'Post unliked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get post comments
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
            .populate('author', 'username profilePicture')
            .sort('-createdAt');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add comment to post
router.post('/:id/comments', protect, async (req, res) => {
    try {
        const comment = new Comment({
            content: req.body.content,
            author: req.user.id,
            post: req.params.id
        });
        await comment.save();
        
        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'username profilePicture');
            
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete comment
router.delete('/comments/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await comment.remove();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
