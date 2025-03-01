const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles');
    },
    filename: (req, file, cb) => {
        // Ajout d'un timestamp pour éviter les conflits de noms
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        // Accepter uniquement les images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images sont autorisées'));
        }
    }
});

// Get all users with post count (admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const usersWithPostCount = await Promise.all(
            users.map(async (user) => {
                const postCount = await Post.countDocuments({ author: user._id });
                return {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    postCount
                };
            })
        );
        res.json(usersWithPostCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update profile
router.put('/profile', protect, upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Mise à jour des champs de base
        if (req.body.username) user.username = req.body.username;
        if (req.body.email) user.email = req.body.email;
        if (req.body.bio) user.bio = req.body.bio;

        // Gestion de la photo de profil
        if (req.file) {
            console.log('Nouvelle photo de profil reçue:', req.file);
            user.profilePicture = '/uploads/profiles/' + req.file.filename;
        }

        const updatedUser = await user.save();
        console.log('Profil mis à jour:', updatedUser);

        // Retourner l'utilisateur sans le mot de passe
        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        
        res.json(userResponse);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
    }
});

// Delete profile
router.delete('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all user's posts
        await Post.deleteMany({ author: user._id });
        
        // Delete all user's comments
        await Comment.deleteMany({ author: user._id });
        
        // Delete all user's likes
        await Like.deleteMany({ user: user._id });

        // Delete the user
        await user.remove();

        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user account
router.delete('/me', protect, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if trying to delete admin
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin user' });
        }

        // Delete all user's posts
        await Post.deleteMany({ author: user._id });
        
        // Delete the user
        await User.findByIdAndDelete(user._id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
