# ☕ BrewMaster Coffee Shop - Focused Walkthrough

## 1. Overview of the Challenge

### Challenge Summary
BrewMaster Coffee Shop is a web application security challenge that simulates a modern coffee ordering platform built with Node.js, Express, and MongoDB. The challenge demonstrates how multiple seemingly minor vulnerabilities can be chained together to achieve complete system compromise.

### Application Details
- **Platform:** Node.js web application hosted on Azure
- **Database:** MongoDB (in-memory)
- **Authentication:** JWT (JSON Web Tokens)
- **Access:** Available via TryHackMe room URL
- **Default Credentials:** `testuser:password123`

### Vulnerability Chain Overview
The challenge follows a logical attack progression where each vulnerability discovery enables the next:

```
Reconnaissance → XSS Discovery → NoSQL Injection → JWT Analysis → 
Secret Extraction → Privilege Escalation → IDOR Exploitation → Final Flag
```

### Learning Objectives
- Understand vulnerability chaining techniques
- Master web application reconnaissance
- Learn NoSQL injection exploitation
- Practice JWT token manipulation
- Exploit Insecure Direct Object References (IDOR)
- Gain hands-on experience with security tools

---

## 2. Steps to Exploit Each Vulnerability

### Task 1: Deploy & Discover (Reconnaissance)

**Vulnerability Type:** Information Disclosure  
**Target:** Application structure and functionality

**Exploitation Steps:**
1. **Access Application**
   - Use the URL provided in the TryHackMe room
   - No local setup required (hosted on Azure)

2. **Initial Reconnaissance**
   - Login with default credentials: `testuser:password123`
   - Explore application features and structure
   - Document available functionality

3. **HTTP Method Analysis**
   - Open browser Developer Tools (F12)
   - Monitor Network tab during login
   - Identify HTTP methods used (POST for login form)

**Key Discovery:** Application uses Express.js with JWT authentication

---

### Task 2: XSS Discovery (Cross-Site Scripting)

**Vulnerability Type:** Reflected XSS  
**Target:** Search functionality in coffee menu

**Exploitation Steps:**
1. **Locate Search Function**
   - Navigate to coffee menu page
   - Find search input field

2. **Test for XSS**
   ```html
   <script>alert('XSS Test')</script>
   ```
   - Inject payload into search field
   - Submit and observe response

3. **Information Gathering**
   - Look for custom alert messages
   - Document any revealed information
   - **Discovery:** "Dio" holds all secrets

**Result:** XSS vulnerability confirmed, target user "Dio" identified

---

### Task 3: NoSQL Injection (Authentication Bypass)

**Vulnerability Type:** NoSQL Injection  
**Target:** Login authentication system

**Exploitation Steps:**
1. **Setup Burp Suite**
   - Configure browser proxy (127.0.0.1:8080)
   - Enable request interception

2. **Intercept Login Request**
   - Attempt login with any credentials
   - Capture POST request to `/auth/login`

3. **NoSQL Injection Attack**
   - Target user "Dio" (from XSS discovery)
   - Modify request payload:
   ```json
   {
     "username": "Dio",
     "password": {"$ne": null}
   }
   ```

4. **Analyze Response**
   - Forward modified request
   - Extract authentication token and XSS key

**Result:** Authentication bypassed, Flag 1 obtained

---

### Task 4: JWT Analysis (Token Structure)

**Vulnerability Type:** Information Disclosure  
**Target:** JWT token structure and algorithm

**Exploitation Steps:**
1. **Extract JWT Token**
   - From browser storage or authentication response
   - Copy complete token string

2. **Token Decoding**
   - Visit https://jwt.io
   - Paste token into decoder
   - Analyze header, payload, and signature

3. **Algorithm Identification**
   - Check `alg` field in header
   - **Discovery:** HS256 (symmetric algorithm)

4. **Token Analysis**
   ```json
   {
     "header": {"alg": "HS256", "typ": "JWT"},
     "payload": {"sub": "user_id", "role": "user", "iat": 123456, "exp": 789012}
   }
   ```

**Result:** JWT uses HS256, tokens contain role information

---

### Task 5: JWT Secret Extraction (Configuration Access)

**Vulnerability Type:** Insecure Configuration Exposure  
**Target:** JWT signing secret

**Exploitation Steps:**
1. **Use XSS Key**
   - Utilize XSS key from Task 3: `DioBrandoSecretKey2025`
   - Test for configuration endpoint access

2. **Endpoint Discovery**
   - Test common configuration paths:
     - `/config?key=DioBrandoSecretKey2025`
     - `/admin/config`
     - `/debug`

3. **Secret Extraction**
   - Access configuration endpoint using XSS key
   - Locate JWT_SECRET environment variable
   - **Discovery:** JWT secret is `cofee123`

**Result:** JWT signing secret extracted, Flag 2 obtained

---

### Task 6: Privilege Escalation (JWT Forgery)

**Vulnerability Type:** JWT Token Forgery  
**Target:** Admin role escalation

**Exploitation Steps:**
1. **Token Modification**
   - Use jwt.io to decode current token
   - Change role from "user" to "admin"
   ```json
   {
     "sub": "admin_user",
     "role": "admin",
     "iat": current_timestamp,
     "exp": future_timestamp
   }
   ```

2. **Token Signing**
   - Use JWT secret from Task 5: `cofee123`
   - Sign modified token with HS256 algorithm

3. **Browser Storage Update**
   ```javascript
   localStorage.setItem('jwt_token', 'NEW_ADMIN_JWT');
   document.cookie = 'token=NEW_ADMIN_JWT; path=/; SameSite=Lax';
   location.reload();
   ```

4. **Admin Access Verification**
   - Navigate to `/admin/dashboard`
   - Confirm administrative access

**Result:** Admin privileges gained, Flag 3 obtained

---

### Task 7: IDOR Exploitation (File Access)

**Vulnerability Type:** Insecure Direct Object References  
**Target:** Admin file server

**Exploitation Steps:**
1. **File Server Discovery**
   - Access admin dashboard with forged token
   - Locate file management functionality

2. **URL Pattern Analysis**
   - Observe file access pattern: `/admin/files/{id}`
   - Note sequential file ID structure

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
   - Access invalid file ID (e.g., /admin/files/999)
   - Error reveals highest valid file ID: 5

5. **Sensitive File Access**
   - Access file ID 5 for administrative data
   - Document file contents for Task 8

**Result:** Unauthorized file access achieved, preparation for final flag

---

### Task 8: Final Flag (Data Decoding)

**Vulnerability Type:** Information Disclosure  
**Target:** Encoded data in administrative files

**Exploitation Steps:**
1. **Locate Encoded Data**
   - Access file ID 5 from IDOR exploitation
   - Find Base64-encoded string in file contents

2. **Base64 Decoding**
   ```bash
   # Windows PowerShell
   [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("ENCODED_STRING"))
   
   # Linux/macOS
   echo "ENCODED_STRING" | base64 -d
   ```

3. **URL Analysis**
   - Decoded string reveals YouTube URL
   - Extract components:
     - Domain: `www.youtube.com`
     - Video ID: `dQw4w9WgXcQ`

4. **Final Discovery**
   - Complete URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ`
   - Recognition: Classic "Rickroll" meme

**Result:** Final flag obtained, challenge completed

---

## 3. Explanation of Flags

### Flag 1: `DioBrandoSecretKey2025`
**Location:** Task 3 - NoSQL Injection Response  
**Context:** XSS key for configuration access  
**Significance:** This flag represents the XSS key obtained through NoSQL injection bypass. It demonstrates how one vulnerability (NoSQL injection) can provide access tokens for exploiting other vulnerabilities. The key is named after "Dio Brando," a reference to the anime/manga series JoJo's Bizarre Adventure.

**How to Capture:**
- Exploit NoSQL injection with payload: `{"username": "Dio", "password": {"$ne": null}}`
- Extract key from authentication response
- Key enables access to configuration endpoints

---

### Flag 2: `cofee123`
**Location:** Task 5 - JWT Secret Extraction  
**Context:** JWT signing secret  
**Significance:** This flag is the JWT signing secret used by the application. It represents a critical security vulnerability where sensitive configuration data is exposed through accessible endpoints. The weak secret (`cofee123`) demonstrates poor secret management practices.

**How to Capture:**
- Use XSS key from Flag 1 to access configuration endpoints
- Locate JWT_SECRET environment variable
- Extract secret value for token forgery

**Security Impact:** With this secret, attackers can forge any JWT token, including admin tokens for privilege escalation.

---

### Flag 3: `You_Are_The_Admin_Now`
**Location:** Task 6 - Admin Dashboard  
**Context:** Privilege escalation confirmation  
**Significance:** This flag confirms successful privilege escalation from regular user to administrator. It demonstrates the impact of JWT token forgery when the signing secret is compromised. The flag message emphasizes the achievement of administrative access.

**How to Capture:**
- Use JWT secret from Flag 2 to forge admin token
- Update browser storage with forged token
- Access `/admin/dashboard` to retrieve flag

**Security Impact:** Admin access provides unrestricted access to sensitive application functions and data.

---

### Flag 4: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ`
**Location:** Task 8 - Decoded Administrative File  
**Context:** Rickroll URL (Internet meme)  
**Significance:** This flag represents the final surprise of the challenge - a classic "Rickroll" internet meme. The URL points to Rick Astley's "Never Gonna Give You Up" music video, a popular internet prank. It demonstrates data encoding/decoding techniques while adding humor to the challenge conclusion.

**How to Capture:**
- Use IDOR vulnerability to access file ID 5
- Locate Base64-encoded string in file contents
- Decode string to reveal YouTube URL

**Cultural Context:** The Rickroll is one of the internet's most famous memes, representing the playful side of cybersecurity education.

### Flag Analysis Summary

| Flag | Type | Vulnerability | Impact Level | Educational Value |
|------|------|---------------|--------------|-------------------|
| 1 | Access Key | NoSQL Injection | High | Authentication bypass techniques |
| 2 | Secret | Config Exposure | Critical | Secret management importance |
| 3 | Confirmation | Privilege Escalation | Critical | Admin access achievement |
| 4 | Surprise | Data Encoding | Low | Decoding techniques + humor |

### Key Learning Points from Flags

1. **Vulnerability Chaining:** Each flag enables access to the next vulnerability
2. **Secret Management:** Weak secrets lead to critical compromises
3. **Access Control:** Proper authorization checks prevent privilege escalation
4. **Data Protection:** Sensitive information should never be accessible without authorization
5. **Security Awareness:** Even "harmless" data exposure can lead to system compromise

---

## Summary

This walkthrough demonstrates a complete attack chain where:
1. **Reconnaissance** reveals application structure
2. **XSS discovery** identifies target users
3. **NoSQL injection** bypasses authentication and provides access keys
4. **JWT analysis** reveals token structure and vulnerabilities
5. **Secret extraction** obtains critical signing keys
6. **Privilege escalation** achieves administrative access
7. **IDOR exploitation** accesses unauthorized files
8. **Data decoding** reveals final encoded information

The four flags represent progressive milestones in the attack chain, each building upon previous discoveries to achieve complete system compromise. This challenge effectively demonstrates how multiple vulnerabilities can be chained together to create severe security impacts in real-world applications.