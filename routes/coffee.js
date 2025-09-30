const express = require('express');
const Coffee = require('../models/Coffee');
const router = express.Router();

// Coffee menu page
router.get('/', async (req, res) => {
    try {
        // Vulnerable to NoSQL injection via query parameters
        const category = req.query.category;
        const search = req.query.search;
        
        let filter = { available: true };
        
        if (category) {
            // Direct injection of user input
            filter.category = category;
        }
        
        if (search) {
            // Vulnerable search - allows NoSQL injection
            filter.name = new RegExp(search, 'i');
        }
        
        const coffees = await Coffee.find(filter);
        
        // XSS Vulnerability - pass search query unescaped for rendering
        const unsafeSearch = search || '';
        
        res.render('coffee/menu', { 
            coffees, 
            category: category || 'all',
            search: search || '',
            unsafeSearch: unsafeSearch, // Dangerous unescaped search for XSS
            title: 'Our Coffee Menu'
        });
    } catch (err) {
        console.error(err);
        res.render('coffee/menu', { 
            coffees: [], 
            category: 'all',
            search: '',
            unsafeSearch: '', // Also include in error case
            title: 'Our Coffee Menu',
            error: 'Error loading coffees'
        });
    }
});

// Add to cart (simplified)
router.get('/add-to-cart', (req, res) => {
    // Handle add-to-cart logic
});

router.post('/add-to-cart', (req, res) => {
    const { coffeeId, quantity = 1 } = req.body;
    
    // Simple cart storage in session/cookie
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    
    const existingItem = cart.find(item => item.coffeeId === coffeeId);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cart.push({ coffeeId, quantity: parseInt(quantity) });
    }
    
    res.cookie('cart', JSON.stringify(cart));
    res.json({ success: true, cartSize: cart.length });
});

// Coffee details page (vulnerable to XSS)
router.get('/:id', async (req, res) => {
    try {
        const coffee = await Coffee.findById(req.params.id);
        if (!coffee) {
            return res.status(404).render('404', { title: 'Coffee Not Found' });
        }
        
        // Get user comments from query parameter (XSS vulnerable)
        const comment = req.query.comment || '';
        
        res.render('coffee/details', { 
            coffee, 
            comment, // Direct rendering without escaping
            title: coffee.name 
        });
    } catch (err) {
        console.error(err);
        res.status(404).render('404', { title: 'Coffee Not Found' });
    }
});

module.exports = router;