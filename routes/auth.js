const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

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

        // Special check for targeting Dio specifically
        const isDioTargeted = (typeof username === 'string' && username === 'Dio') ||
            (typeof username === 'object' && username !== null && 
             JSON.stringify(username).includes('Dio'));

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

            // Build response object
            const response = {
                success: true,
                token: token,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                },
                isNoSQLInjection: isNoSQLInjection,
                hint: `Specifically Target Dio to Proceed`
            };

            // Only provide XSS key if targeting Dio specifically with NoSQL injection
            if (isNoSQLInjection && isDioTargeted && user.username === 'Dio') {
                response.xssKey = 'flag1{DioBrandoSecretKey2025}';
                response.message = 'Special access granted - XSS key provided for Dio';
            }

            // Return JSON response with token and conditionally the XSS key
            // Also set cookie for server-side access
            res.cookie('token', token, {
                httpOnly: false, // Allow client-side access for debugging
                secure: false, // Allow over HTTP for development
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            
            res.json(response);
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// API Login endpoint (returns JSON) - Vulnerable like main login
router.post('/login-api', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if this is a NoSQL injection attempt
        const isNoSQLInjection = (typeof username === 'object' && username !== null) ||
            (typeof password === 'object' && password !== null);

        // Special check for targeting Dio specifically
        const isDioTargeted = (typeof username === 'string' && username === 'Dio') ||
            (typeof username === 'object' && username !== null && 
             JSON.stringify(username).includes('Dio'));

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

        // Build response object
        const response = {
            success: true,
            token: token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            },
            isNoSQLInjection: isNoSQLInjection,
            hint: `Specifically Target Dio to Proceed`
        };

        // Only provide XSS key if targeting Dio specifically with NoSQL injection
        if (isNoSQLInjection && isDioTargeted && user.username === 'Dio') {
            response.xssKey = 'flag1{DioBrandoSecretKey2025}';
            response.message = 'Special access granted - XSS key provided for Dio';
        }

        // Return JSON response with token and conditionally the XSS key
        // Also set cookie for server-side access
        res.cookie('token', token, {
            httpOnly: false, // Allow client-side access for debugging
            secure: false, // Allow over HTTP for development
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000 // 1 hour
        });
        
        res.json(response);

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

        // Return JSON response with token
        // Also set cookie for server-side access
        res.cookie('token', token, {
            httpOnly: false, // Allow client-side access for debugging
            secure: false, // Allow over HTTP for development
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        // Redirect to home page after successful registration
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).render('register', {
            error: 'Server error during registration'
        });
    }
});

// Logout (POST)
router.post('/logout', (req, res) => {
    // Clear cookies
    res.clearCookie('token');
    res.clearCookie('jwt_token');
    
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Logout (GET) - for direct navigation
router.get('/logout', (req, res) => {
    // Clear cookies
    res.clearCookie('token');
    res.clearCookie('jwt_token');
    
    // Redirect with script to clear localStorage
    res.send(`
        <script>
            // Clear all possible token storage locations
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('token');
            
            // Clear additional cookie variations via client-side
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            
            console.log('Logged out - All tokens cleared');
            window.location.href = '/';
        </script>
    `);
});

module.exports = router;