# ☕ BrewMaster Coffee Shop - TryHackMe Room Description

## Room Information

**Room Name:** BrewMaster Coffee Shop  
**Room Type:** Challenge  
**Difficulty:** Medium  
**Category:** Web Application Security  
**Tags:** #web #nosql #xss #jwt #idor #burpsuite #vulnchaining  
**Estimated Time:** 45-60 minutes  
**Total Points:** 280

---

## Room Description

Welcome to BrewMaster Coffee Shop! ☕ 

This web application is a modern coffee ordering platform that contains several interconnected security vulnerabilities. Your mission is to exploit these vulnerabilities to gain unauthorized access and capture all the flags.

You'll need to chain multiple vulnerabilities together to achieve complete system compromise. This challenge will test your skills in web application security, including XSS, NoSQL injection, JWT manipulation, and access control vulnerabilities.

### What You'll Learn

- 🎯 Cross-Site Scripting (XSS) exploitation techniques
- 🛠️ NoSQL injection attacks and authentication bypass
- 🔐 JWT token analysis, manipulation, and forgery
- 🔑 Privilege escalation through token manipulation
- 📁 Insecure Direct Object Reference (IDOR) exploitation
- 🔗 Vulnerability chaining for complete system compromise
- 🛡️ Common web application security flaws and their impact

### Prerequisites

- Basic understanding of web applications and HTTP
- Familiarity with Burp Suite (Community edition is sufficient)
- Knowledge of browser developer tools
- Basic JavaScript and JSON understanding
- Understanding of authentication mechanisms

### Tools Required

- **Burp Suite** (Community or Professional)
- **Web Browser** with developer tools
- **jwt.io** for JWT manipulation
- **Base64 decoder** (online tools or command line)

---

## Challenge Overview

This challenge simulates a real-world scenario where multiple seemingly minor vulnerabilities can be chained together to achieve complete system compromise. You'll start with basic reconnaissance and progressively escalate your access through various attack vectors.

### Vulnerability Chain

1. **🔍 Reconnaissance** → Discover application structure and users
2. **⚡ XSS Discovery** → Find script injection points and gather intelligence
3. **💉 NoSQL Injection** → Bypass authentication and extract sensitive keys
4. **🔓 JWT Analysis** → Understand token structure and algorithms
5. **🗝️ Secret Extraction** → Use XSS keys to access configuration data
6. **👑 Privilege Escalation** → Forge admin tokens for elevated access
7. **📂 IDOR Exploitation** → Access unauthorized files and data
8. **🎭 Final Surprise** → Decode the secret message

### Learning Outcomes

By completing this challenge, you will:

- Understand how web application vulnerabilities can be chained together
- Learn practical exploitation techniques for common vulnerability types
- Gain hands-on experience with industry-standard testing tools
- Develop skills in manual testing and vulnerability assessment
- Understand the importance of defense-in-depth security strategies

---

## Deployment Instructions

### Option 1: Downloadable VM/Application (Recommended)

1. Download the BrewMaster Coffee Shop application package
2. Extract the files to your preferred directory
3. Ensure Node.js (version 14 or higher) is installed
4. Navigate to the application directory
5. Run `npm install` to install dependencies
6. Start the application with `npm start`
7. Access the application at `http://localhost:3000`

### Option 2: TryHackMe Hosted Instance

1. Click "Start Machine" to deploy the application
2. Wait for the machine to fully boot (usually 2-3 minutes)
3. Access the application at `http://MACHINE_IP:3000`
4. Use the provided credentials to begin the challenge

### Default Credentials

```
Username: testuser
Password: password123
```

---

## Task Breakdown

### 📋 Task 1: Deploy & Discover (35 points)
- Basic reconnaissance and application exploration
- User authentication and interface navigation
- HTTP method analysis

### ⚡ Task 2: XSS Discovery (25 points)
- Cross-site scripting vulnerability identification
- Script injection in search functionality
- Information gathering through XSS alerts

### 💉 Task 3: NoSQL Injection (45 points)
- Authentication bypass using NoSQL injection
- MongoDB operator exploitation
- Sensitive key extraction

### 🔓 Task 4: JWT Analysis (25 points)
- JWT token structure analysis
- Algorithm identification
- Token expiration assessment

### 🗝️ Task 5: JWT Secret Extraction (30 points)
- Configuration endpoint discovery
- Secret extraction using XSS keys
- Environment variable exposure

### 👑 Task 6: Privilege Escalation (35 points)
- JWT token forgery and manipulation
- Admin privilege escalation
- Browser storage manipulation

### 📂 Task 7: IDOR Exploitation (85 points)
- File server enumeration
- Unauthorized file access
- Sensitive data discovery

### 🎭 Task 8: Final Flag (30 points)
- Base64 decoding techniques
- URL analysis and recognition
- Internet culture awareness

**Total Points:** 280

---

## Security Lessons

This challenge demonstrates several critical security concepts:

### Common Vulnerabilities
- **Input Validation Failures** leading to XSS and injection attacks
- **Authentication Weaknesses** allowing bypass and privilege escalation
- **Insecure Secret Management** exposing JWT signing keys
- **Access Control Failures** enabling unauthorized resource access

### Mitigation Strategies
- Implement comprehensive input validation and output encoding
- Use strong, randomly generated secrets stored securely
- Employ proper authentication and authorization checks
- Implement defense-in-depth security controls
- Regular security testing and code reviews

### Real-World Impact
These vulnerabilities, when chained together, can lead to:
- Complete account takeover
- Unauthorized data access and exfiltration
- Privilege escalation and administrative access
- Business logic bypass and fraud
- Reputational and financial damage

---

## Support and Hints

Each task includes:
- ✅ **Clear objectives** and learning goals
- 💡 **Helpful hints** to guide you in the right direction
- 🛠️ **Tool recommendations** for each phase
- 📚 **Additional resources** for deeper learning
- ⚠️ **Security notes** explaining real-world implications

### Getting Stuck?

- Read the hints carefully - they contain important clues
- Use browser developer tools to inspect requests and responses
- Pay attention to error messages and unusual application behavior
- Take notes of information discovered in early tasks for later use
- Remember that this is a vulnerability chaining challenge

---

## Author Information

**Created by:** Security Education Team  
**Difficulty Level:** Medium  
**Recommended for:** 
- Security students and professionals
- Penetration testers
- Web application developers
- Bug bounty hunters
- CTF enthusiasts

### Disclaimer

⚠️ **Important:** This application contains intentional security vulnerabilities designed for educational purposes. Never attempt these techniques on systems you don't own or have explicit permission to test. Unauthorized testing of security vulnerabilities is illegal and unethical.

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)
- [NoSQL Injection Prevention](https://owasp.org/www-community/Injection_Flaws)

---

**Happy Hacking! Stay Curious, Stay Ethical!** ☕🔐🎯