const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = 'coffee123';

// Login page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Register page
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// Login handler (vulnerable to NoSQL injection)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if this is a NoSQL injection attempt
        const isNoSQLInjection = (typeof username === 'object' && username !== null) ||
            (typeof password === 'object' && password !== null);

        // Vulnerable NoSQL injection - directly using user input
        const user = await User.findOne({
            username: username,
            password: password
        });

        if (user) {
            const token = jwt.sign(
                { userId: user._id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.cookie('token', token, { httpOnly: false }); // Intentionally not httpOnly for XSS

            // Different response based on injection detection
            if (isNoSQLInjection) {
                // NoSQL injection successful - show flag
                res.send(`
                    <script>
                        localStorage.setItem('jwt_token', '${token}');
                        console.log('JWT stored in localStorage:', localStorage.getItem('jwt_token'));
                        
                        // Show NoSQL injection flag
                        alert('🚩 FLAG{nosql_injection_bypass_successful} - Logged in as: ${user.username} (${user.role})');
                        
                        setTimeout(() => {
                            window.location.href = '/coffee';
                        }, 2000);
                    </script>
                `);
            } else {
                // Normal login
                res.send(`
                    <script>
                        localStorage.setItem('jwt_token', '${token}');
                        console.log('JWT stored in localStorage:', localStorage.getItem('jwt_token'));
                        window.location.href = '/coffee';
                    </script>
                `);
            }
        } else {
            res.render('login', { error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Server error' });
    }
});

// API Login endpoint (returns JSON) - Vulnerable like main login
router.post('/login-api', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Same vulnerable NoSQL injection as main login - plain text password comparison
        const user = await User.findOne({
            username: username,
            password: password
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: '1h',
                algorithm: 'HS256' // Will be exploited with "none" algorithm
            }
        );

        // Return JSON response with token
        res.json({
            success: true,
            token: token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('API Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Register handler
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.render('register', { error: 'User already exists' });
        }

        // Create new user (password stored in plain text - another vulnerability!)
        const user = new User({
            username,
            email,
            password, // No hashing!
            profile: {
                firstName,
                lastName
            }
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, { httpOnly: false });
        res.redirect('/coffee');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Server error' });
    }
});

// Logout (POST)
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

// Logout (GET) - for direct navigation
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;