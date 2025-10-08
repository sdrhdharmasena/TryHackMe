# ☕ BrewMaster Coffee Shop - Setup Instructions

## 🚀 Quick Start Guide

Welcome to the BrewMaster Coffee Shop security challenge! Follow these steps to get the application running on your local machine.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (Node Package Manager) - Usually comes with Node.js
- **Web browser** (Chrome, Firefox, Edge, Safari)
- **Burp Suite Community Edition** (recommended) - [Download here](https://portswigger.net/burp/communitydownload)

### Verify Installation

Open a terminal/command prompt and run:
```bash
node --version
npm --version
```

Both commands should return version numbers. If not, please install Node.js first.

---

## 🛠️ Installation Steps

### Step 1: Extract the Application
- Extract the downloaded ZIP file to your preferred directory
- Open a terminal/command prompt
- Navigate to the extracted folder:
  ```bash
  cd path/to/BrewMaster-Coffee-Shop
  ```

### Step 2: Install Dependencies
Run the following command to install all required dependencies:
```bash
npm install
```

This will download and install all necessary packages listed in `package.json`.

### Step 3: Start the Application
Start the server with:
```bash
npm start
```

You should see output similar to:
```
Server running on http://localhost:3000
Database connected successfully
BrewMaster Coffee Shop is ready! ☕
```

### Step 4: Access the Application
- Open your web browser
- Navigate to: **http://localhost:3000**
- You should see the BrewMaster Coffee Shop welcome page

---

## 🔐 Default Login Credentials

Use these credentials to begin the challenge:

```
Username: testuser
Password: password123
```

**Important:** These are intentional credentials for the security challenge!

---

## 🛠️ Required Tools

### Essential Tools

1. **Web Browser with Developer Tools**
   - Press F12 to open developer tools
   - Use Network tab to inspect HTTP requests
   - Use Console tab for JavaScript execution

2. **Burp Suite Community Edition** (Highly Recommended)
   - Download from: https://portswigger.net/burp/communitydownload
   - Configure your browser to use Burp as proxy (127.0.0.1:8080)
   - Essential for NoSQL injection tasks

### Optional Tools

3. **jwt.io**
   - Online JWT decoder/encoder
   - Access at: https://jwt.io
   - Useful for JWT manipulation tasks

4. **Base64 Decoder**
   - Any online Base64 decoder
   - Or use command line tools
   - Needed for the final task

---

## 🚨 Troubleshooting

### Port 3000 Already in Use

If you get an error that port 3000 is busy:

**Option 1: Use a different port**
```bash
PORT=3001 npm start
```
Then access: http://localhost:3001

**Option 2: Kill the process using port 3000**
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# On macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Dependencies Installation Issues

If `npm install` fails:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Try with different registry:**
   ```bash
   npm install --registry https://registry.npmjs.org/
   ```

### Application Won't Start

If the application fails to start:

1. **Check Node.js version:**
   ```bash
   node --version
   ```
   Ensure it's version 14 or higher.

2. **Check for missing dependencies:**
   ```bash
   npm list
   ```

3. **Look at error messages:**
   Read the terminal output carefully for specific error details.

4. **Restart with verbose logging:**
   ```bash
   DEBUG=* npm start
   ```

### Database Connection Issues

If you see database errors:

1. **The application uses in-memory database** - no external database required
2. **If issues persist, restart the application:**
   - Press Ctrl+C to stop
   - Run `npm start` again

---

## 🎯 Getting Started with the Challenge

### 1. Explore the Application
- Register a new account or use the default credentials
- Browse the coffee menu
- Try ordering coffee
- Examine the search functionality

### 2. Set Up Your Testing Environment
- Configure Burp Suite proxy if using
- Open browser developer tools
- Familiarize yourself with the application structure

### 3. Begin the Tasks
- Start with Task 1: Deploy & Discover
- Follow the tasks in sequential order
- Each task builds upon the previous one
- Take notes of your discoveries!

### 4. Key Areas to Explore
- Search functionality (XSS vulnerabilities)
- Login/authentication system (NoSQL injection)
- User profile and JWT tokens
- Admin panel (after privilege escalation)
- File server (IDOR vulnerabilities)

---

## 📝 Important Notes

### Security Warnings
⚠️ **This application contains intentional security vulnerabilities!**
- Only run in isolated/testing environments
- Never deploy to production
- Do not expose to the internet
- Use only for educational purposes

### Challenge Tips
💡 **For the best experience:**
- Read hints carefully - they contain important clues
- Take screenshots of important findings
- Keep notes of usernames, passwords, and keys discovered
- Tasks are designed to be completed in order
- Information from early tasks is used in later ones

### Common Mistakes to Avoid
❌ **Avoid these pitfalls:**
- Skipping tasks or doing them out of order
- Not reading error messages carefully
- Forgetting to check different HTTP methods
- Missing important information in response headers
- Not updating browser storage after token changes

---

## 🆘 Getting Help

### If You're Stuck
1. **Re-read the task description and hints**
2. **Check your browser's developer tools**
3. **Verify you've completed previous tasks correctly**
4. **Look for error messages or unusual responses**
5. **Try different approaches or tools**

### Resources
- **OWASP Testing Guide:** https://owasp.org/www-project-web-security-testing-guide/
- **PortSwigger Academy:** https://portswigger.net/web-security
- **JWT.io Documentation:** https://jwt.io/introduction/
- **Burp Suite Documentation:** https://portswigger.net/burp/documentation

---

## 🎉 Challenge Structure

**Total Tasks:** 8  
**Total Points:** 280  
**Estimated Time:** 45-60 minutes  
**Difficulty:** Medium  

### Task Overview
1. **Deploy & Discover** (35 pts) - Basic reconnaissance
2. **XSS Discovery** (25 pts) - Find script injection vulnerabilities
3. **NoSQL Injection** (45 pts) - Bypass authentication
4. **JWT Analysis** (25 pts) - Understand token structure
5. **JWT Secret Extraction** (30 pts) - Extract signing secrets
6. **Privilege Escalation** (35 pts) - Forge admin tokens
7. **IDOR Exploitation** (85 pts) - Access unauthorized files
8. **Final Flag** (30 pts) - Decode the secret message

---

## 📞 Support

If you encounter technical issues with the application setup:

1. **Check the troubleshooting section above**
2. **Ensure all prerequisites are installed correctly**
3. **Read error messages carefully**
4. **Try restarting the application**

For challenge-related questions:
- **Read the hints provided in each task**
- **Consult the resources listed above**
- **Remember that this is a learning experience!**

---

**Happy Hacking! Stay Curious, Stay Ethical!** ☕🔐

Remember: The goal is to learn web application security concepts through hands-on practice. Take your time, think critically, and enjoy the journey!