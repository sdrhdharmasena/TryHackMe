const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Coffee = require('../models/Coffee');
const Order = require('../models/Order');
const router = express.Router();

const JWT_SECRET = 'coffee123';

// Admin auth middleware (weak authorization)
const adminAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/auth/login');
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET, { 
            algorithms: ['HS256', 'none'] // Allows none algorithm bypass
        });
        
        // Weak check - only checks if role exists, not if it's actually 'admin'
        if (!decoded.role) {
            return res.status(403).render('error', { 
                error: 'Access denied',
                title: 'Access Denied' 
            });
        }
        
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/auth/login');
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
router.get('/secret', adminAuth, (req, res) => {
    // No X-Frame-Options header - vulnerable to clickjacking
    res.render('admin/secret', {
        flag: 'flag{clickjacking_secret_accessed}',
        title: 'Secret Admin Panel'
    });
});

module.exports = router;