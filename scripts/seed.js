const mongoose = require('mongoose');
const User = require('../models/User');
const Coffee = require('../models/Coffee');
const Order = require('../models/Order');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Hansanee:password!@hanz.fqagmcd.mongodb.net/Coffee?retryWrites=true&w=majority&appName=Hanz';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    seedData();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Make sure MongoDB is running or update MONGODB_URI environment variable');
});

async function seedData() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Coffee.deleteMany({});
        await Order.deleteMany({});

        // Create users
        const users = [
            {
                username: 'admin',
                email: 'admin@brewmaster.com',
                password: 'admin123', // Plain text password
                role: 'admin',
                profile: {
                    firstName: 'Admin',
                    lastName: 'User'
                }
            },
            {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                role: 'user',
                profile: {
                    firstName: 'Test',
                    lastName: 'User'
                }
            },
            {
                username: 'john',
                email: 'john@example.com',
                password: 'secret',
                role: 'user',
                profile: {
                    firstName: 'John',
                    lastName: 'Doe',
                    address: '123 Main St, City',
                    phone: '555-0123'
                }
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log('Users created:', createdUsers.length);

        // Create coffees
        const coffees = [
            // Brewed coffees (served at shop)
            {
                name: 'Cappuccino',
                description: 'Rich espresso topped with steamed milk and foam',
                price: 4.50,
                category: 'brewed'
            },
            {
                name: 'Americano',
                description: 'Bold espresso diluted with hot water',
                price: 3.75,
                category: 'brewed'
            },
            {
                name: 'Latte',
                description: 'Smooth espresso with steamed milk and light foam',
                price: 5.25,
                category: 'brewed'
            },
            {
                name: 'Macchiato',
                description: 'Espresso "stained" with a dollop of foamed milk',
                price: 4.75,
                category: 'brewed'
            },
            {
                name: 'Mocha',
                description: 'Espresso with chocolate syrup and steamed milk',
                price: 5.50,
                category: 'brewed'
            },

            // Coffee blends (online sales)
            {
                name: 'BrewMaster Signature Blend',
                description: 'Our signature medium roast with notes of chocolate and caramel. Perfect for any time of day.',
                price: 18.99,
                category: 'blend'
            },
            {
                name: 'Mountain Peak Dark Roast',
                description: 'Full-bodied dark roast with bold, smoky flavors. Ideal for espresso.',
                price: 21.50,
                category: 'blend'
            },
            {
                name: 'Sunrise Light Roast',
                description: 'Bright and acidic light roast with floral notes. Great for pour-over brewing.',
                price: 19.75,
                category: 'blend'
            },
            {
                name: 'Decaf Colombian',
                description: 'Smooth decaffeinated Colombian beans with nutty undertones.',
                price: 17.25,
                category: 'blend'
            },
            {
                name: 'Ethiopian Single Origin',
                description: 'Exotic single-origin Ethiopian beans with fruity and wine-like characteristics.',
                price: 24.99,
                category: 'blend'
            }
        ];

        const createdCoffees = await Coffee.insertMany(coffees);
        console.log('Coffees created:', createdCoffees.length);

        // Create some sample orders
        const orders = [
            {
                userId: createdUsers[1]._id, // testuser
                items: [
                    {
                        coffee: createdCoffees[0]._id,
                        name: createdCoffees[0].name,
                        price: createdCoffees[0].price,
                        quantity: 2
                    },
                    {
                        coffee: createdCoffees[5]._id,
                        name: createdCoffees[5].name,
                        price: createdCoffees[5].price,
                        quantity: 1
                    }
                ],
                totalAmount: 27.99,
                status: 'completed',
                customerInfo: {
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '555-0100',
                    address: '456 Oak St, Town'
                },
                notes: 'Please grind beans for espresso'
            },
            {
                userId: createdUsers[2]._id, // john
                items: [
                    {
                        coffee: createdCoffees[1]._id,
                        name: createdCoffees[1].name,
                        price: createdCoffees[1].price,
                        quantity: 1
                    },
                    {
                        coffee: createdCoffees[2]._id,
                        name: createdCoffees[2].name,
                        price: createdCoffees[2].price,
                        quantity: 1
                    }
                ],
                totalAmount: 9.00,
                status: 'pending',
                customerInfo: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '555-0123',
                    address: '123 Main St, City'
                }
            }
        ];

        const createdOrders = await Order.insertMany(orders);
        console.log('Orders created:', createdOrders.length);

        console.log('\n=== SEED DATA COMPLETE ===');
        console.log('Admin Login: admin / admin123');
        console.log('Test User Login: testuser / password123');
        console.log('John User Login: john / secret');
        console.log('\n=== IDOR USER POSITIONS ===');
        console.log('Position 1: admin (admin@brewmaster.com)');
        console.log('Position 2: testuser (test@example.com)');
        console.log('Position 3: john (john@example.com)');
        console.log('\nIDOR Test URLs:');
        console.log('- http://localhost:3000/order/view/1 (admin orders)');
        console.log('- http://localhost:3000/order/view/2 (testuser orders)');
        console.log('- http://localhost:3000/order/view/3 (john orders)');
        console.log('\nFlags hidden in various locations:');
        console.log('- Admin dashboard flag');
        console.log('- Secret admin panel flag (clickjacking vulnerable)');
        console.log('- Path traversal flag in server files');
        console.log('- XSS flag via comment parameter');
        console.log('- NoSQL injection bypass login');

        mongoose.connection.close();
    } catch (err) {
        console.error('Seed error:', err);
        mongoose.connection.close();
    }
}