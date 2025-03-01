require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_DOMAIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directories if they don't exist
const fs = require('fs');
const uploadDirs = ['uploads', 'uploads/profiles', 'uploads/posts'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// MongoDB connection with retry logic
const connectWithRetry = async () => {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog');
            console.log('Successfully connected to MongoDB.');
            return true;
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            retries += 1;
            if (retries === maxRetries) {
                console.error('Max retries reached. Could not connect to MongoDB.');
                return false;
            }
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
        }
    }
};

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/categories', categoryRoutes);
app.use('/categories/:categoryId/posts', categoryRoutes);
app.use('/comments', commentRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 9000;

const startServer = async () => {
    const isConnected = await connectWithRetry();
    if (isConnected) {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please choose a different port or stop the running process.`);
            } else {
                console.error('Server error:', err);
            }
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

startServer();
