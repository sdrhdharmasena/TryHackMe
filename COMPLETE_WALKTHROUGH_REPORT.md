# 🔍 BrewMaster Coffee Shop - Complete Walkthrough Report

## Executive Summary

**Challenge Name:** BrewMaster Coffee Shop  
**Challenge Type:** Web Application Security CTF  
**Difficulty Level:** Medium  
**Total Tasks:** 8  
**Total Flags:** 4  
**Estimated Time:** 45-60 minutes  
**Date Completed:** October 5, 2025  

### Challenge Overview

The BrewMaster Coffee Shop is a comprehensive web application security challenge that demonstrates real-world vulnerability chaining. Participants must exploit multiple interconnected vulnerabilities including Cross-Site Scripting (XSS), NoSQL injection, JWT manipulation, and Insecure Direct Object References (IDOR) to achieve complete system compromise.

The challenge simulates a modern coffee shop ordering platform built with Node.js, Express, and MongoDB, containing intentional security vulnerabilities that mirror common real-world web application flaws.

---

## 🎯 Challenge Architecture

### Application Stack
- **Frontend:** HTML5, CSS3, JavaScript, EJS templating
- **Backend:** Node.js with Express.js framework
- **Database:** MongoDB (in-memory for challenge)
- **Authentication:** JWT (JSON Web Tokens)
- **Port:** 3000 (default)

### Vulnerability Chain Overview
The challenge follows a logical attack progression:
1. **Reconnaissance** → Application discovery and user enumeration
2. **XSS Discovery** → Information gathering and user targeting
3. **NoSQL Injection** → Authentication bypass and key extraction
4. **JWT Analysis** → Token structure understanding
5. **Secret Extraction** → Configuration data access
6. **Privilege Escalation** → Admin token forgery
7. **IDOR Exploitation** → Unauthorized file access
8. **Data Decoding** → Final flag revelation

---

## 📋 Detailed Task Walkthrough

### Task 1: Deploy & Discover
**Objective:** Basic reconnaissance and application exploration  
**Points:** 35  
**Difficulty:** Beginner  

#### Steps to Complete:
1. **Application Setup**
   ```bash
   npm install
   npm start
   ```
   Access application at `http://localhost:3000`

2. **Initial Reconnaissance**
   - Navigate to the application homepage
   - Examine the application structure and functionality
   - Identify login mechanisms and user registration

3. **Authentication Testing**
   - Login with provided credentials: `testuser:password123`
   - Explore user profile and account features
   - Document available functionality

4. **HTTP Method Analysis**
   - Open browser Developer Tools (F12)
   - Navigate to Network tab
   - Attempt login and observe HTTP requests
   - **Answer:** POST method is used for form submission

#### Key Findings:
- Application uses Express.js framework
- MongoDB database backend
- JWT-based authentication system
- User profile reveals first name: "Test"
- Login form uses POST method for authentication

---

### Task 2: XSS Discovery
**Objective:** Identify and exploit Cross-Site Scripting vulnerabilities  
**Points:** 25  
**Difficulty:** Beginner to Intermediate  

#### Steps to Complete:
1. **Search Functionality Testing**
   - Navigate to coffee menu section
   - Locate search input field
   - Test for reflected XSS vulnerabilities

2. **XSS Payload Injection**
   ```html
   <script>alert('XSS Test')</script>
   ```
   - Inject basic script tags into search field
   - Observe application response and behavior

3. **Information Gathering**
   - Look for custom alert messages or responses
   - Document any usernames or sensitive information revealed
   - **Answer:** "Dio" is mentioned as holding all secrets

#### Key Findings:
- Search functionality vulnerable to reflected XSS
- Custom alert reveals information about privileged user "Dio"
- XSS vulnerability can be used for information gathering
- Application lacks proper input sanitization

#### Vulnerability Details:
**Type:** Reflected Cross-Site Scripting  
**Location:** Search functionality in coffee menu  
**Impact:** Information disclosure, potential session hijacking  
**CVSS Score:** Medium (6.1)  

---

### Task 3: NoSQL Injection
**Objective:** Exploit authentication system using NoSQL injection  
**Points:** 45  
**Difficulty:** Intermediate  

#### Steps to Complete:
1. **Burp Suite Configuration**
   - Configure browser proxy to use Burp Suite (127.0.0.1:8080)
   - Enable request/response interception

2. **Authentication Request Interception**
   - Navigate to login page
   - Attempt login with any credentials
   - Intercept the POST request in Burp Suite

3. **NoSQL Injection Attack**
   - Identify JSON-based authentication
   - Target user "Dio" (discovered in Task 2)
   - Modify the request payload:
   ```json
   {
     "username": "Dio",
     "password": {"$ne": null}
   }
   ```

4. **Response Analysis**
   - Forward the modified request
   - Examine response for authentication bypass
   - **FLAG 1 CAPTURED:** `DioBrandoSecretKey2025`

#### Key Findings:
- Authentication system vulnerable to NoSQL injection
- MongoDB `$ne` operator bypasses password validation
- Successful bypass reveals XSS key for configuration access
- Application lacks proper input validation and parameterized queries

#### Vulnerability Details:
**Type:** NoSQL Injection (Authentication Bypass)  
**Location:** Login endpoint `/auth/login`  
**Payload:** `{"username": "Dio", "password": {"$ne": null}}`  
**Impact:** Complete authentication bypass  
**CVSS Score:** High (8.1)  

**🏆 FLAG 1:** `DioBrandoSecretKey2025`

---

### Task 4: JWT Analysis
**Objective:** Analyze JWT tokens for structure and security  
**Points:** 25  
**Difficulty:** Beginner to Intermediate  

#### Steps to Complete:
1. **JWT Token Extraction**
   - Login successfully using NoSQL injection
   - Extract JWT token from browser storage or cookies
   - Document token location and format

2. **Token Decoding**
   - Visit https://jwt.io
   - Paste the extracted JWT token
   - Analyze header, payload, and signature sections

3. **Algorithm Identification**
   - Examine the `alg` field in token header
   - **Answer:** HS256 (HMAC SHA-256)

4. **Token Structure Analysis**
   ```json
   {
     "header": {
       "alg": "HS256",
       "typ": "JWT"
     },
     "payload": {
       "sub": "user_id",
       "iat": timestamp,
       "exp": timestamp,
       "role": "user"
     }
   }
   ```

#### Key Findings:
- JWT tokens use HS256 symmetric signing algorithm
- Tokens contain user role information
- Symmetric algorithm means same key used for signing and verification
- Token structure reveals potential for privilege escalation

#### Security Analysis:
**Algorithm:** HS256 (Symmetric)  
**Vulnerability:** If secret is known, tokens can be forged  
**Impact:** Potential privilege escalation  

---

### Task 5: JWT Secret Extraction
**Objective:** Extract the JWT signing secret from the application  
**Points:** 30  
**Difficulty:** Intermediate  

#### Steps to Complete:
1. **XSS Key Utilization**
   - Use the XSS key obtained from Task 3: `DioBrandoSecretKey2025`
   - Look for configuration endpoints or special access

2. **Configuration Endpoint Discovery**
   - Test various endpoints with XSS key as parameter
   - Common patterns: `/config`, `/debug`, `/admin/config`
   - Use XSS key in headers or query parameters

3. **Secret Extraction**
   - Access configuration endpoint using XSS key
   - Locate JWT_SECRET environment variable
   - **FLAG 2 CAPTURED:** `cofee123`

#### Key Findings:
- XSS key provides access to configuration endpoints
- JWT secret exposed through configuration interface
- Weak secret (`cofee123`) makes token forgery feasible
- Application exposes sensitive configuration data

#### Vulnerability Details:
**Type:** Information Disclosure / Insecure Configuration  
**Location:** Configuration endpoint  
**Access Method:** XSS key authentication  
**Impact:** JWT secret exposure enabling token forgery  
**CVSS Score:** High (7.5)  

**🏆 FLAG 2:** `cofee123`

---

### Task 6: Privilege Escalation
**Objective:** Forge admin JWT tokens for privilege escalation  
**Points:** 35  
**Difficulty:** Intermediate  

#### Steps to Complete:
1. **Current Token Analysis**
   - Decode existing JWT token using jwt.io
   - Note current user role and permissions

2. **Admin Token Forgery**
   - Modify token payload to change role to "admin"
   ```json
   {
     "sub": "admin_user",
     "iat": current_timestamp,
     "exp": future_timestamp,
     "role": "admin"
   }
   ```

3. **Token Signing**
   - Use JWT secret from Task 5: `cofee123`
   - Sign the modified token using HS256 algorithm
   - Generate new admin JWT token

4. **Browser Storage Update**
   ```javascript
   // Update localStorage
   localStorage.setItem('jwt_token', 'NEW_ADMIN_JWT_TOKEN');
   
   // Update cookies
   document.cookie = 'token=NEW_ADMIN_JWT_TOKEN; path=/; SameSite=Lax';
   
   // Reload page
   location.reload();
   ```

5. **Admin Access Verification**
   - Navigate to `/admin/dashboard`
   - Verify administrative access granted
   - **FLAG 3 CAPTURED:** `You_Are_The_Admin_Now`

#### Key Findings:
- Successful JWT token forgery using extracted secret
- Admin role grants access to administrative dashboard
- Browser storage manipulation bypasses client-side validation
- Privilege escalation achieved through token manipulation

#### Vulnerability Details:
**Type:** Privilege Escalation via JWT Forgery  
**Method:** Token manipulation with known secret  
**Impact:** Administrative access to sensitive functions  
**CVSS Score:** High (8.8)  

**🏆 FLAG 3:** `You_Are_The_Admin_Now`

---

### Task 7: IDOR Exploitation
**Objective:** Exploit Insecure Direct Object References in the file server  
**Points:** 60  
**Difficulty:** Intermediate  

#### Steps to Complete:
1. **Admin Panel Exploration**
   - Access admin dashboard using forged token
   - Locate file server or file management functionality
   - Document available file access patterns

2. **IDOR Pattern Identification**
   - Observe file access URLs (e.g., `/admin/files/1`)
   - Identify sequential file ID patterns
   - Note predictable resource identifiers

3. **File Enumeration**
   - Test sequential file IDs:
   ```
   /admin/files/1
   /admin/files/2
   /admin/files/3
   /admin/files/4
   /admin/files/5
   ```

4. **Error Message Analysis**
   - Access invalid file IDs to trigger error messages
   - Error reveals highest valid file ID: **5**
   - Document file system structure hints

5. **Sensitive File Access**
   - Enumerate all accessible files
   - Locate administrative backup files
   - Document file contents and sensitive information

#### Key Findings:
- File server lacks proper authorization checks
- Sequential file IDs enable systematic enumeration
- Highest valid file ID is 5 (revealed in error messages)
- Administrative files contain sensitive configuration data

#### Vulnerability Details:
**Type:** Insecure Direct Object References (IDOR)  
**Location:** File server endpoints `/admin/files/{id}`  
**Method:** Sequential ID enumeration  
**Impact:** Unauthorized access to sensitive files  
**CVSS Score:** High (7.5)  

---

### Task 8: Final Flag
**Objective:** Decode the secret message and discover the final surprise  
**Points:** 30  
**Difficulty:** Beginner to Intermediate  

#### Steps to Complete:
1. **Sensitive File Analysis**
   - Access file ID 5 (highest discovered file)
   - Locate encoded data within file contents
   - Identify Base64-encoded string

2. **Base64 Decoding**
   ```bash
   # Windows PowerShell
   [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("ENCODED_STRING"))
   
   # Linux/Mac
   echo "ENCODED_STRING" | base64 -d
   ```

3. **URL Analysis**
   - Decoded string reveals YouTube URL
   - Extract domain: `www.youtube.com`
   - Extract video ID: `dQw4w9WgXcQ`

4. **Final Flag Discovery**
   - Complete YouTube URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - **FLAG 4 CAPTURED:** `https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ`
   - Recognition: Classic "Rickroll" internet meme

#### Key Findings:
- Administrative files contain Base64-encoded data
- Decoded data reveals popular internet meme reference
- Challenge ends with humorous Rickroll surprise
- Demonstrates common data encoding techniques

#### Vulnerability Details:
**Type:** Information Disclosure  
**Method:** Base64 decoding of hidden data  
**Impact:** Access to encoded information  
**Cultural Reference:** Rick Astley - "Never Gonna Give You Up"  

**🏆 FLAG 4:** `https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ`

---

## 🏆 Flag Summary

| Flag # | Task | Value | Description |
|--------|------|-------|-------------|
| **Flag 1** | Task 3 | `DioBrandoSecretKey2025` | XSS key from NoSQL injection |
| **Flag 2** | Task 5 | `cofee123` | JWT signing secret |
| **Flag 3** | Task 6 | `You_Are_The_Admin_Now` | Admin privilege escalation |
| **Flag 4** | Task 8 | `https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ` | Rickroll URL |

---

## 🔒 Vulnerability Assessment Summary

### Critical Vulnerabilities Identified

1. **NoSQL Injection (CVSS: 8.1 - High)**
   - **Location:** Authentication endpoint
   - **Impact:** Complete authentication bypass
   - **Mitigation:** Input validation, parameterized queries

2. **JWT Secret Exposure (CVSS: 7.5 - High)**
   - **Location:** Configuration endpoints
   - **Impact:** Token forgery capabilities
   - **Mitigation:** Secure secret management, environment variables

3. **Privilege Escalation (CVSS: 8.8 - High)**
   - **Location:** JWT token validation
   - **Impact:** Administrative access bypass
   - **Mitigation:** Strong secrets, server-side role validation

4. **IDOR Vulnerabilities (CVSS: 7.5 - High)**
   - **Location:** File server endpoints
   - **Impact:** Unauthorized file access
   - **Mitigation:** Authorization checks, UUID identifiers

5. **Cross-Site Scripting (CVSS: 6.1 - Medium)**
   - **Location:** Search functionality
   - **Impact:** Information disclosure, session hijacking
   - **Mitigation:** Input sanitization, output encoding

### Risk Assessment

**Overall Risk Level:** **HIGH**

The combination of these vulnerabilities creates a critical security posture where:
- Complete system compromise is achievable
- Administrative access can be gained by any user
- Sensitive data is accessible without authorization
- Multiple attack vectors exist for privilege escalation

---

## 🛡️ Remediation Recommendations

### Immediate Actions Required

1. **Input Validation Implementation**
   ```javascript
   // Implement proper input sanitization
   const sanitizedInput = validator.escape(userInput);
   ```

2. **NoSQL Injection Prevention**
   ```javascript
   // Use parameterized queries
   User.findOne({
     username: username,
     password: hashedPassword
   });
   ```

3. **JWT Security Hardening**
   ```javascript
   // Use strong, randomly generated secrets
   const JWT_SECRET = crypto.randomBytes(64).toString('hex');
   
   // Implement proper token validation
   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
     // Validate user permissions server-side
   });
   ```

4. **IDOR Protection**
   ```javascript
   // Implement authorization checks
   if (user.role !== 'admin' || !user.canAccessFile(fileId)) {
     return res.status(403).json({ error: 'Unauthorized' });
   }
   ```

5. **XSS Prevention**
   ```javascript
   // Implement output encoding
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'"]
       }
     }
   }));
   ```

### Long-term Security Improvements

- **Security Code Reviews:** Regular assessment of code for vulnerabilities
- **Penetration Testing:** Quarterly security assessments
- **Security Training:** Developer education on secure coding practices
- **Monitoring Implementation:** Real-time security event monitoring
- **Incident Response Plan:** Documented procedures for security incidents

---

## 📊 Educational Value Assessment

### Skills Demonstrated

1. **Web Application Reconnaissance**
   - Manual testing techniques
   - Information gathering methodologies
   - Application structure analysis

2. **Vulnerability Exploitation**
   - XSS payload crafting and execution
   - NoSQL injection attack vectors
   - JWT token manipulation techniques
   - IDOR enumeration strategies

3. **Tool Proficiency**
   - Burp Suite for request interception
   - Browser developer tools for analysis
   - JWT.io for token manipulation
   - Command-line encoding/decoding tools

4. **Attack Chain Development**
   - Multi-step vulnerability exploitation
   - Information gathering for subsequent attacks
   - Privilege escalation techniques
   - Complete system compromise methodology

### Real-World Applications

- **Penetration Testing:** Direct application in security assessments
- **Bug Bounty Hunting:** Common vulnerability patterns in web applications
- **Security Development:** Understanding of attack vectors for secure coding
- **Incident Response:** Recognition of attack patterns and indicators

---

## 🎯 Conclusion

The BrewMaster Coffee Shop challenge successfully demonstrates the critical importance of defense-in-depth security strategies in web application development. Through a carefully orchestrated vulnerability chain, participants experience firsthand how seemingly minor security flaws can compound to enable complete system compromise.

### Key Takeaways

1. **Vulnerability Chaining Impact:** Individual vulnerabilities become exponentially more dangerous when combined
2. **Authentication Security:** Proper input validation and secure authentication mechanisms are fundamental
3. **JWT Security:** Token-based authentication requires careful implementation and secret management
4. **Access Control:** Authorization checks must be implemented at every privilege boundary
5. **Input Validation:** All user input must be validated, sanitized, and properly handled

### Challenge Success Metrics

- **Educational Objective:** ✅ Achieved comprehensive web security education
- **Skill Development:** ✅ Progressed from basic reconnaissance to advanced exploitation
- **Real-World Relevance:** ✅ Demonstrated common vulnerabilities in modern applications
- **Tool Integration:** ✅ Practical use of industry-standard security tools
- **Attack Methodology:** ✅ Systematic approach to vulnerability exploitation

This walkthrough demonstrates that the BrewMaster Coffee Shop challenge effectively bridges the gap between theoretical security knowledge and practical exploitation skills, providing valuable hands-on experience for cybersecurity professionals and enthusiasts.

---

**Report Prepared By:** Security Analysis Team  
**Date:** October 5, 2025  
**Challenge Completion Time:** 47 minutes  
**Overall Assessment:** Excellent educational value with realistic vulnerability scenarios