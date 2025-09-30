const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Coffee = require('../models/Coffee');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Simple auth middleware
const authenticate = (req, res, next) => {
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

// Cart page
router.get('/cart', (req, res) => {
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    res.render('order/cart', { cart, title: 'Shopping Cart' });
});

// Checkout page
router.get('/checkout', authenticate, async (req, res) => {
    try {
        const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
        const cartItems = [];
        let totalAmount = 0;

        for (const item of cart) {
            const coffee = await Coffee.findById(item.coffeeId);
            if (coffee) {
                const itemTotal = coffee.price * item.quantity;
                cartItems.push({
                    coffee,
                    quantity: item.quantity,
                    total: itemTotal
                });
                totalAmount += itemTotal;
            }
        }

        res.render('order/checkout', {
            cartItems,
            totalAmount,
            title: 'Checkout'
        });
    } catch (err) {
        console.error(err);
        res.render('order/checkout', {
            cartItems: [],
            totalAmount: 0,
            error: 'Error loading cart',
            title: 'Checkout'
        });
    }
});

// Place order
router.post('/place', authenticate, async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, customerAddress, notes } = req.body;
        const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

        if (cart.length === 0) {
            return res.render('order/checkout', {
                error: 'Cart is empty',
                cartItems: [],
                totalAmount: 0,
                title: 'Checkout'
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart) {
            const coffee = await Coffee.findById(item.coffeeId);
            if (coffee) {
                const itemTotal = coffee.price * item.quantity;
                orderItems.push({
                    coffee: coffee._id,
                    name: coffee.name,
                    price: coffee.price,
                    quantity: item.quantity
                });
                totalAmount += itemTotal;
            }
        }

        const order = new Order({
            userId: req.user.userId,
            items: orderItems,
            totalAmount,
            customerInfo: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                address: customerAddress
            },
            notes
        });

        await order.save();

        // Clear cart
        res.clearCookie('cart');

        res.render('order/success', {
            order,
            title: 'Order Placed Successfully'
        });
    } catch (err) {
        console.error(err);
        res.render('order/checkout', {
            error: 'Error placing order',
            cartItems: [],
            totalAmount: 0,
            title: 'Checkout'
        });
    }
});

// View orders (vulnerable - can access other user's orders by integer position)
router.get('/view/:userId', authenticate, async (req, res) => {
    try {
        const userPosition = parseInt(req.params.userId);

        // Check if it's a valid integer
        if (isNaN(userPosition) || userPosition < 1) {
            return res.render('order/view', {
                orders: [],
                user: null,
                error: 'Invalid user ID. Use integers starting from 1.',
                title: 'Order History'
            });
        }

        // Get all users ordered by creation (IDOR vulnerability - no auth check)
        const allUsers = await User.find({}).sort({ _id: 1 });

        // Get user at the specified position (1-indexed)
        const targetUser = allUsers[userPosition - 1];

        if (!targetUser) {
            return res.render('order/view', {
                orders: [],
                user: null,
                error: `User not found at position ${userPosition}. Try positions 1-${allUsers.length}.`,
                title: 'Order History'
            });
        }

        // Find orders for this user using their actual ObjectId
        const orders = await Order.find({ userId: targetUser._id }).populate('items.coffee');

        res.render('order/view', {
            orders,
            user: targetUser,
            title: `Order History - ${targetUser.username}`,
            userPosition: userPosition
        });
    } catch (err) {
        console.error(err);
        res.render('order/view', {
            orders: [],
            user: null,
            error: 'Error loading orders',
            title: 'Order History'
        });
    }
});

// My orders
router.get('/my-orders', authenticate, (req, res) => {
    res.redirect(`/order/view/${req.user.userId}`);
});

module.exports = router;