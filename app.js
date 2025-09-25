const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection - Update this with your MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Make sure MongoDB is running or update MONGODB_URI environment variable');
});

// JWT Secret (intentionally weak for demonstration)
const JWT_SECRET = 'coffee123';

// Middleware to check user authentication and make user data available to all views
app.use((req, res, next) => {
    let token = req.cookies.token; // Check cookies first

    // Also check Authorization header for localStorage-based tokens
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET, {
                algorithms: ['HS256', 'none'] // Intentionally vulnerable
            });
            res.locals.user = decoded; // Make user data available to all views
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }

    next();
});

// Import routes
const authRoutes = require('./routes/auth');
const coffeeRoutes = require('./routes/coffee');
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/auth', authRoutes);
app.use('/coffee', coffeeRoutes);
app.use('/order', orderRoutes);
app.use('/admin', adminRoutes);

// JWT Demo route (for educational purposes)
app.get('/jwt-demo', (req, res) => {
    res.render('jwt-demo', {
        title: 'JWT LocalStorage Demo - Coffee Shop',
        user: res.locals.user
    });
});

// IDOR Demo route (for educational purposes)
app.get('/idor-demo', (req, res) => {
    res.render('idor-demo', {
        title: 'IDOR Vulnerability Demo - Coffee Shop',
        user: res.locals.user
    });
});

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'BrewMaster Coffee Shop' });
});

// Vulnerable file serving endpoint (Path Traversal)
app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    // Intentionally vulnerable - no path sanitization
    const filePath = path.join(__dirname, 'uploads', filename);

    try {
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Basic auth middleware (intentionally flawed for JWT bypass)
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];

    if (!token) {
        return res.status(401).render('login', { error: 'Access denied' });
    }

    try {
        // Vulnerable: accepts "none" algorithm
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256', 'none'] // This allows JWT bypass!
        });
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).render('login', { error: 'Invalid token' });
    }
};

app.locals.authenticateToken = authenticateToken;

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}`);
});

module.exports = app;