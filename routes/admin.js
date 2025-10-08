const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Coffee = require('../models/Coffee');
const Order = require('../models/Order');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Admin auth middleware (weak authorization)
const adminAuth = (req, res, next) => {
    let token = req.cookies.token; // Check cookies first
    
    // Also check Authorization header for localStorage-based tokens
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    
    if (!token) {
        return res.redirect('/auth/login');
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET, { 
            algorithms: ['HS256'] // Removed 'none' algorithm vulnerability
        });
        
        // Strict token validation
        if (!decoded || typeof decoded !== 'object') {
            throw new Error('Invalid token structure');
        }
        
        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
            console.log('Token expired for user:', decoded.username);
            res.clearCookie('token');
            return res.redirect('/auth/login');
        }
        
        // Check if token has required fields
        if (!decoded.userId || !decoded.username) {
            throw new Error('Token missing required fields');
        }
        
        // Strict admin role check - only allow users with 'admin' role
        if (!decoded.role || decoded.role !== 'admin') {
            return res.status(403).render('404', { 
                error: 'Access denied - Admin role required',
                title: 'Access Denied' 
            });
        }
        
        req.user = decoded;
        next();
    } catch (err) {
        console.log('Token validation failed:', err.message);
        // Clear invalid tokens
        res.clearCookie('token');
        res.clearCookie('jwt_token');
        return res.redirect('/auth/login');
    }
};

// Admin dashboard
router.get('/dashboard', adminAuth, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const orderCount = await Order.countDocuments();
        const coffeeCount = await Coffee.countDocuments();
        
        // Hidden flag for admin access
        const flag = req.user.role === 'admin' ? 'flag{admin_dashboard_accessed}' : null;
        
        res.render('admin/dashboard', {
            userCount,
            orderCount,
            coffeeCount,
            flag,
            title: 'Admin Dashboard'
        });
    } catch (err) {
        console.error(err);
        res.render('admin/dashboard', {
            userCount: 0,
            orderCount: 0,
            coffeeCount: 0,
            flag: null,
            error: 'Error loading dashboard',
            title: 'Admin Dashboard'
        });
    }
});

// Manage coffees
router.get('/coffees', adminAuth, async (req, res) => {
    try {
        const coffees = await Coffee.find({});
        res.render('admin/coffees', {
            coffees,
            title: 'Manage Coffees'
        });
    } catch (err) {
        console.error(err);
        res.render('admin/coffees', {
            coffees: [],
            error: 'Error loading coffees',
            title: 'Manage Coffees'
        });
    }
});

// Add coffee form
router.get('/add-coffee', adminAuth, (req, res) => {
    res.render('admin/add-coffee', {
        title: 'Add New Coffee'
    });
});

// Add coffee handler
router.post('/add-coffee', adminAuth, async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        
        const coffee = new Coffee({
            name,
            description,
            price: parseFloat(price),
            category
        });
        
        await coffee.save();
        res.redirect('/admin/coffees');
    } catch (err) {
        console.error(err);
        res.render('admin/add-coffee', {
            error: 'Error adding coffee',
            title: 'Add New Coffee'
        });
    }
});

// View users (admin only)
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.render('admin/users', {
            users,
            title: 'Manage Users'
        });
    } catch (err) {
        console.error(err);
        res.render('admin/users', {
            users: [],
            error: 'Error loading users',
            title: 'Manage Users'
        });
    }
});

// Secret admin endpoint with flag (clickjacking vulnerable)
// router.get('/secret', adminAuth, (req, res) => {
//     // No X-Frame-Options header - vulnerable to clickjacking
//     res.render('admin/secret', {
//         flag: 'flag{clickjacking_secret_accessed}',
//         title: 'Secret Admin Panel'
//     });
// });

// Admin file serving endpoint (vulnerable to IDOR)
router.get('/files/:id', adminAuth, (req, res) => {
    const fileId = req.params.id;
    const path = require('path');
    const fs = require('fs');
    
    // File mapping - IDOR vulnerability: predictable file IDs
    const fileMap = {
        '1': 'company_overview.txt',
        '2': 'sales_report.txt',
        '3': 'employee_directory.txt',
        '4': 'marketing_plan.txt',
        '5': 'admin_backup.txt',
        '6': 'get_this_or_you_lose.txt'  // Secret file!
    };
    
    console.log(`\n=== ADMIN FILE ACCESS (IDOR) ===`);
    console.log(`Requested File ID: ${fileId}`);
    console.log(`Mapped Filename: ${fileMap[fileId] || 'Not found'}`);
    console.log(`================================\n`);
    
    // Vulnerable: No authorization check on which files user can access
    // Only checks if user is admin, not which specific files they should access
    const filename = fileMap[fileId];
    
    if (!filename) {
        return res.status(404).json({
            error: 'File not found',
            message: `No file with ID: ${fileId}`,
            // hint: 'Try file IDs 1-5',
            // availableIds: ['1', '2', '3', '4', '5', '6']
        });
    }
    
    const basePath = path.join(__dirname, '..', 'public', 'files');
    const filePath = path.join(basePath, filename);
    
    try {
        if (fs.existsSync(filePath)) {
            // Set appropriate headers
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            res.sendFile(filePath);
        } else {
            res.status(404).json({
                error: 'File not found on disk',
                message: `File ${filename} exists in mapping but not on disk`
            });
        }
    } catch (err) {
        console.error('File serving error:', err);
        res.status(500).json({
            error: 'Server error',
            message: 'Error accessing file',
            debug: err.message
        });
    }
});

module.exports = router;