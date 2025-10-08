# BrewMaster Coffee Shop

A Node.js web application for a fictional coffee shop that serves as a security testing environment for educational purposes.

## 🚨 **SECURITY NOTICE**
This application contains intentional security vulnerabilities for educational and testing purposes only. **NEVER deploy this in a production environment.**

## 📋 Overview

BrewMaster Coffee Shop is a full-featured e-commerce web application built with Node.js, Express, and MongoDB. It simulates a real coffee shop with user authentication, product catalog, shopping cart, order management, and admin dashboard functionality.

### Key Features
- **User Authentication**: Registration, login, and JWT-based sessions
- **Coffee Menu**: Browse coffee products with detailed descriptions
- **Shopping Cart**: Add products to cart and checkout
- **Order Management**: View order history and details
- **Admin Dashboard**: Administrative interface with user and product management
- **File Management**: Document upload and download system
- **Responsive Design**: Mobile-friendly Bootstrap interface

### Application Components

**Frontend:**
- EJS templating with Bootstrap 5 styling
- Interactive JavaScript for cart functionality
- Responsive design with coffee-themed UI

**Backend:**
- Express.js REST API
- MongoDB database with Mongoose ODM
- JWT authentication system
- File upload/download capabilities
- Admin panel with role-based access

**Security Features (Intentionally Vulnerable):**
- Input validation systems
- Authentication mechanisms  
- Authorization controls
- File access controls
- XSS protection measures
- CSRF protections

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Quick Start

1. **Clone and install:**
```bash
git clone <repository-url>
cd TryHackMe
npm install
```

2. **Configure environment:**
Create a `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

3. **Start the application:**
```bash
npm start
```

4. **Access the application:**
Open http://localhost:3000 in your browser

### Default Test Accounts
```
Admin Account:
- Username: admin
- Password: admin123

Regular User:
- Username: testuser  
- Password: password123
```

## 🏗️ Project Structure

```
├── app.js                 # Main application server
├── package.json           # Node.js dependencies
├── models/                # Database models (User, Coffee, Order)
├── routes/                # API endpoints (auth, coffee, order, admin)
├── views/                 # EJS templates and pages
├── public/                # Static assets (CSS, JS, images)
├── uploads/               # File upload directory
└── scripts/               # Database seeding scripts
```

## 🎯 Application Flow

1. **User Registration/Login** → JWT token generation
2. **Browse Coffee Menu** → Product catalog with search/filter
3. **Add to Cart** → Session-based shopping cart
4. **Checkout Process** → Order creation and confirmation
5. **Order Management** → View order history and details
6. **Admin Functions** → User/product management (admin only)

## 🔧 Technical Details

**Stack:**
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT tokens
- **Frontend**: EJS templates + Bootstrap 5
- **Styling**: Custom CSS with coffee theme

**Key Dependencies:**
- express: Web application framework
- mongoose: MongoDB object modeling
- jsonwebtoken: JWT implementation
- ejs: Embedded JavaScript templating
- cookie-parser: Cookie parsing middleware

## 📚 Educational Purpose

This application serves as a comprehensive example of:
- Modern web application architecture
- RESTful API design patterns
- Database integration with MongoDB
- Authentication and authorization systems
- Frontend-backend integration
- File upload/download functionality
- Admin panel implementation

## ⚖️ Legal Notice

This software is provided exclusively for educational and authorized security testing purposes. Users must ensure they have proper authorization before conducting any security assessments. The developers are not responsible for any misuse of this application.

---

**Built for educational purposes** • **Never use in production** • **Always test responsibly**