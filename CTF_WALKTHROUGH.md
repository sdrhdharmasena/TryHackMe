# ☕ Coffee Shop CTF - TryHackMe Walkthrough

## 🎯 **Challenge Overview**
Welcome to the **BrewMaster Coffee Shop CTF**! This web application is intentionally vulnerable and contains multiple security flaws that you'll need to chain together to capture all the flags. You'll explore NoSQL injection, XSS, JWT manipulation, and IDOR vulnerabilities.

**Difficulty Level:** Intermediate  
**Estimated Time:** 45-60 minutes  
**Required Tools:** Burp Suite, Browser Developer Tools, Base64 decoder

---

## 🏁 **Objectives**
- **8 Flags Total** to capture through various exploitation techniques
- Learn about modern web application vulnerabilities
- Practice with Burp Suite, browser developer tools, and manual testing
- Understand vulnerability chaining for privilege escalation

---

## 🛠️ **Tools Required**
- **Burp Suite Community Edition** (for NoSQL injection)
- **Browser Developer Tools** (F12 - for JWT manipulation)
- **jwt.io** (for JWT decoding/encoding)
- **Base64 decoder** (online tool or command line)
- **Modern Web Browser** (Chrome, Firefox, or Edge)

---

## 📋 **Step-by-Step Walkthrough**

### **Step 1: Initial Reconnaissance & Login** 🔍

**Objective:** Gain initial access to the application and understand its structure.

#### Actions:
1. **Navigate** to the coffee shop application:
   ```
   https://coffee-apd9gkgqg5h9fqa5.southindia-01.azurewebsites.net
   ```
   *(or `http://localhost:3000` if running locally)*

2. **Explore** the application:
   - Browse the coffee menu
   - Check the register and login pages
   - Examine the navbar and available features

3. **Login** with the provided test credentials:
   - **Username:** `testuser`
   - **Password:** `password123`

4. **Success!** You should now be authenticated as a regular user

#### 🚩 **Flag 1:** `User authenticated successfully`

**Learning Points:**
- Application uses JWT tokens for authentication
- Tokens are stored in both localStorage and cookies
- Basic user vs admin role distinction exists

---

### **Step 2: XSS Discovery & Hint Collection** 🕵️

**Objective:** Discover the XSS vulnerability in the search functionality and uncover hints.

#### Actions:
1. **Navigate** to the coffee menu:
   ```
   /coffee
   ```

2. **Locate** the search box at the top of the menu page

3. **Test for XSS** by entering the following payload:
   ```html
   <script>alert('test')</script>
   ```

4. **Submit** the search query

5. **Observe** the result:
   - A custom alert should appear: **"Dio holds all the secrets"**
   - This is a hint pointing you to a user named "Dio"

6. **Note:** The search parameter is vulnerable to XSS due to unsafe rendering with `<%- unsafeSearch %>` in the template

#### 🚩 **Flag 2:** `XSS vulnerability discovered - Dio holds all the secrets`

**Learning Points:**
- XSS occurs when user input is rendered without sanitization
- The hint suggests targeting a specific user: "Dio"
- This will be important for the next exploitation step

---

### **Step 3: NoSQL Injection with Burp Suite** 🔓

**Objective:** Exploit NoSQL injection to bypass authentication and extract Dio's credentials along with a special XSS key.

#### Actions:

1. **Setup Burp Suite:**
   - Open Burp Suite Community Edition
   - Go to Proxy → Intercept
   - Configure your browser to use Burp proxy (127.0.0.1:8080)

2. **Navigate** to the login page and turn on intercept

3. **First Attempt - Basic NoSQL Injection:**
   - In the browser, attempt to login (any credentials)
   - Intercept the POST request to `/auth/login`
   - Modify the request body to:
   ```json
   {
     "username": {"$ne": null},
     "password": {"$ne": null}
   }
   ```
   - **Forward** the request
   - **Response:** You'll get a hint suggesting to target Dio specifically

4. **Second Attempt - Targeted NoSQL Injection:**
   - Intercept another login request
   - Modify the request to target Dio:
   ```json
   {
     "username": "Dio",
     "password": {"$ne": null}
   }
   ```
   - **Forward** the request

5. **Success!** The response contains:
   - **Dio's JWT Token:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **XSS Key:** `DioBrandoSecretKey2025`
   - **User data:** Including Dio's role and user ID

#### 🚩 **Flag 3:** `XSS Key acquired: DioBrandoSecretKey2025`

**Burp Suite Request Example:**
```http
POST /auth/login HTTP/1.1
Host: coffee-apd9gkgqg5h9fqa5.southindia-01.azurewebsites.net
Content-Type: application/json
Content-Length: 60

{"username":"Dio","password":{"$ne":null}}
```

**Learning Points:**
- NoSQL injection bypasses authentication by manipulating query operators
- `$ne` (not equal) operator returns true for any value
- Application stores passwords in plain text (another vulnerability!)
- Special keys/secrets can be exposed through API responses

---

### **Step 4: JWT Token Acquisition** 🎫

**Objective:** Obtain a valid JWT token for further exploitation.

#### Actions:

**Option A - Use Dio's Token:**
- Copy the JWT token from the Burp Suite response in Step 3
- Store it for later use

**Option B - Login Normally:**
1. **Login** with testuser credentials in your browser:
   - Username: `testuser`
   - Password: `password123`

2. **Open Developer Tools** (F12)

3. **Navigate** to Console tab

4. **Get your JWT token:**
   ```javascript
   localStorage.getItem('jwt_token')
   ```

5. **Copy** the token value

#### 🚩 **Flag 4:** `Valid JWT token obtained`

**Learning Points:**
- JWT tokens are stored in both localStorage and cookies
- Tokens contain encoded user information (payload)
- Tokens are signed but the signature can be verified if you know the secret

---

### **Step 5: Advanced XSS for JWT Secret Extraction** 🔑

**Objective:** Use the XSS key from Step 3 to extract the server's JWT secret key.

#### Actions:

1. **Navigate** to any coffee detail page:
   - Go to `/coffee` menu
   - Click on any coffee item to view details

2. **Locate** the XSS vulnerability (check comments, reviews, or URL parameters)

3. **Craft** an XSS payload using the acquired key:
   ```html
   <script>
   // Using the XSS key: DioBrandoSecretKey2025
   // This payload should reveal the JWT secret
   fetch('/api/secret?key=DioBrandoSecretKey2025')
     .then(r => r.json())
     .then(data => alert('JWT Secret: ' + data.secret));
   </script>
   ```

4. **Alternative approach** - Check for secret exposure:
   - Look for exposed configuration endpoints
   - Check developer comments in page source
   - Try accessing `/api/config` or similar endpoints with the XSS key

5. **Expected JWT Secret:** The application's JWT signing key will be revealed

#### 🚩 **Flag 5:** `JWT Secret Key extracted`

**Note:** The exact JWT secret depends on your `.env` configuration. Common test values might be `coffee_shop_secret_2025` or similar.

**Learning Points:**
- XSS can be used to make authenticated requests
- API keys/secrets should never be exposed through client-side code
- Proper secret management is critical for security

---

### **Step 6: JWT Privilege Escalation** 👑

**Objective:** Forge an admin JWT token to gain administrative access.

#### Actions:

1. **Get your current JWT token:**
   ```javascript
   localStorage.getItem('jwt_token')
   ```

2. **Copy** the token value

3. **Navigate** to [jwt.io](https://jwt.io)

4. **Paste** your JWT in the "Encoded" section (left side)

5. **Examine** the decoded payload (middle section):
   ```json
   {
     "userId": "668d4ed24f2c5b864ddaa7729",
     "username": "testuser",
     "role": "user",
     "iat": 1759242102,
     "exp": 1759245702
   }
   ```

6. **Modify** the role to admin:
   ```json
   {
     "userId": "668d4ed24f2c5b864ddaa7729",
     "username": "testuser",
     "role": "admin",
     "iat": 1759242102,
     "exp": 1759245702
   }
   ```

7. **Enter the JWT Secret** (from Step 5) in the "Verify Signature" section (right side)

8. **Copy** the new forged JWT from the "Encoded" section

9. **Set the forged token** in your browser:
   ```javascript
   localStorage.setItem('jwt_token', 'YOUR_FORGED_JWT_HERE');
   document.cookie = 'token=YOUR_FORGED_JWT_HERE; path=/; SameSite=Lax';
   ```

10. **Reload** the page:
    ```javascript
    location.reload();
    ```

11. **Success!** You should now have admin access - check the navbar for admin options

#### 🚩 **Flag 6:** `Admin privileges escalated successfully`

**Learning Points:**
- JWT tokens are only as secure as their signing secret
- If an attacker knows the secret, they can forge any token
- Role-based access control must be properly validated server-side
- Never trust client-side tokens without verification

---

### **Step 7: Admin Dashboard Access** 🏢

**Objective:** Access the admin dashboard and capture the admin flag.

#### Actions:

1. **Navigate** to the admin dashboard:
   ```
   /admin/dashboard
   ```
   
   **Alternative:** Click "Admin Dashboard" in the navbar

2. **Verify** you have admin access:
   - You should see statistics: Total Users, Total Orders, Coffee Products
   - Admin sidebar with management options
   - System information panel

3. **Locate** the flag display section (golden background)

4. **Capture** the admin flag:

#### 🚩 **Flag 7:** `flag{admin_dashboard_accessed}`

5. **Read** the File Server section carefully:
   - Note the hint: "Are there more files beyond ID 4?"
   - This is a clue for the next step

**Learning Points:**
- Admin dashboards often expose sensitive information
- Proper authorization checks are essential
- Information disclosure can lead to further exploitation

---

### **Step 8: IDOR & Final Flag** 🗂️

**Objective:** Exploit IDOR (Insecure Direct Object Reference) to access hidden files and retrieve the final flag.

#### Actions:

1. **From the admin dashboard**, locate the "Admin File Server" section

2. **Click** on "View File 1 (Company Overview)"
   - URL: `/admin/files/1`
   - This shows the company overview document

3. **Observe** the URL pattern:
   ```
   /admin/files/{id}
   ```

4. **Read the hint:**
   > "Are there more files beyond ID 4? 🤔"

5. **Exploit IDOR** by manually incrementing the file ID:

   **File ID 2 - Sales Report:**
   ```
   /admin/files/2
   ```
   
   **File ID 3 - Employee Directory:**
   ```
   /admin/files/3
   ```
   
   **File ID 4 - Marketing Plan:**
   ```
   /admin/files/4
   ```
   
   **File ID 5 - SECRET ADMIN BACKUP:**
   ```
   /admin/files/5
   ```

6. **Access File ID 5** - you'll see:
   ```
   ************************************************************************************

   CONFIDENTIAL - ADMIN ACCESS ONLY

   BrewMaster Coffee - Secret Administrative File
   ===============================================

   🚩 CTF FLAG: You_Found_The_Secret_File!

   Congratulations! You've successfully exploited the IDOR vulnerability.

   IDOR (Insecure Direct Object Reference) occurs when applications expose
   internal implementation objects (like file IDs) without proper authorization.

   Get the final flag by decoding this:
   aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUSZsaXN0PVJEZFF3NHc5V2dYY1E=

   Document ID: 5

   ************************************************************************************
   ```

7. **Decode** the Base64 string:
   
   **Online:** Use https://www.base64decode.org/
   
   **Command Line:**
   ```bash
   echo "aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUSZsaXN0PVJEZFF3NHc5V2dYY1E=" | base64 -d
   ```
   
   **PowerShell:**
   ```powershell
   [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUSZsaXN0PVJEZFF3NHc5V2dYY1E="))
   ```

8. **Decoded result:**
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ
   ```

#### 🚩 **Final Flag (Flag 8):** `Never gonna give you up! 🎵`

**Easter Egg:** You've been rickrolled! This is a classic internet meme and a fun way to end the CTF.

**Learning Points:**
- IDOR vulnerabilities allow unauthorized access to resources
- Sequential IDs are predictable and should not be used for access control
- Always implement proper authorization checks for each resource
- Use UUIDs or access tokens instead of sequential IDs for sensitive resources

---

## 🎖️ **Summary of Captured Flags**

| Step | Flag | Vulnerability |
|------|------|---------------|
| 1 | User authenticated successfully | Initial Access |
| 2 | XSS vulnerability discovered - Dio holds all the secrets | Cross-Site Scripting |
| 3 | XSS Key acquired: DioBrandoSecretKey2025 | NoSQL Injection |
| 4 | Valid JWT token obtained | Token Management |
| 5 | JWT Secret Key extracted | Information Disclosure |
| 6 | Admin privileges escalated successfully | JWT Forgery |
| 7 | flag{admin_dashboard_accessed} | Authorization Bypass |
| 8 | Never gonna give you up! 🎵 | IDOR + Base64 Decoding |

---

## 🔍 **Vulnerability Summary**

### **1. Cross-Site Scripting (XSS)**
- **Location:** Coffee search functionality (`/coffee`)
- **Type:** Reflected XSS
- **Cause:** Unsafe rendering with `<%- unsafeSearch %>`
- **Impact:** Can execute arbitrary JavaScript in user's browser

### **2. NoSQL Injection**
- **Location:** Login endpoint (`/auth/login`)
- **Type:** Authentication bypass
- **Cause:** Direct use of user input in MongoDB queries
- **Impact:** Complete authentication bypass, unauthorized access

### **3. Plaintext Password Storage**
- **Location:** Database (User model)
- **Type:** Insecure storage
- **Cause:** No password hashing
- **Impact:** Password exposure if database is compromised

### **4. Information Disclosure**
- **Location:** API responses
- **Type:** Sensitive data exposure
- **Cause:** Exposing XSS keys and secrets in responses
- **Impact:** Leakage of cryptographic secrets

### **5. JWT Secret Exposure**
- **Location:** Client-side code / API endpoints
- **Type:** Cryptographic failure
- **Cause:** Hardcoded or exposed JWT signing secret
- **Impact:** Ability to forge any JWT token

### **6. Insecure JWT Validation**
- **Location:** Authentication middleware
- **Type:** Broken authentication
- **Cause:** Trusting client-provided tokens without proper validation
- **Impact:** Privilege escalation through token manipulation

### **7. Insecure Direct Object Reference (IDOR)**
- **Location:** File serving endpoint (`/admin/files/:id`)
- **Type:** Broken access control
- **Cause:** No authorization check on specific file access
- **Impact:** Unauthorized access to sensitive files

### **8. Missing Authorization Checks**
- **Location:** Various admin endpoints
- **Type:** Broken access control
- **Cause:** Only checking if user is admin, not what they can access
- **Impact:** Horizontal and vertical privilege escalation

---

## 🛡️ **Security Recommendations**

### **For Developers:**

1. **Input Validation & Sanitization:**
   - Always sanitize user input before rendering
   - Use parameterized queries for database operations
   - Implement Content Security Policy (CSP)

2. **Password Security:**
   - Use bcrypt, argon2, or scrypt for password hashing
   - Never store passwords in plain text
   - Implement password strength requirements

3. **JWT Best Practices:**
   - Use strong, random secrets (minimum 256 bits)
   - Store secrets in environment variables, never in code
   - Implement short expiration times
   - Use refresh token rotation

4. **Access Control:**
   - Implement proper authorization for each resource
   - Use UUIDs instead of sequential IDs
   - Verify user permissions for every action
   - Follow principle of least privilege

5. **API Security:**
   - Never expose sensitive information in responses
   - Implement rate limiting
   - Use HTTPS in production
   - Validate all input server-side

---

## 🎓 **Learning Outcomes**

After completing this CTF, you should understand:

✅ How to identify and exploit XSS vulnerabilities  
✅ How NoSQL injection differs from SQL injection  
✅ How JWT tokens work and their security implications  
✅ How to use Burp Suite for intercepting and modifying requests  
✅ How IDOR vulnerabilities allow unauthorized resource access  
✅ How to chain multiple vulnerabilities for complete system compromise  
✅ The importance of proper input validation and output encoding  
✅ Why secrets should never be hardcoded or exposed  

---

## 🏆 **Congratulations!**

You've successfully completed the **BrewMaster Coffee Shop CTF**! 

You've demonstrated skills in:
- Web application reconnaissance
- XSS exploitation
- NoSQL injection
- JWT token manipulation
- IDOR vulnerability exploitation
- Privilege escalation
- Base64 encoding/decoding

**Total Flags Captured:** 8/8 ✅

This challenge showcased how multiple smaller vulnerabilities can be chained together to achieve complete application compromise. Always remember: defense in depth is crucial - one vulnerability should never lead to total system compromise.

---

## 📚 **Additional Resources**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP NoSQL Injection](https://owasp.org/www-community/Injection_Flaws)
- [JWT.io - JWT Debugger](https://jwt.io)
- [OWASP JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

---

## 📝 **CTF Credits**

**Challenge Name:** BrewMaster Coffee Shop CTF  
**Category:** Web Application Security  
**Difficulty:** Intermediate  
**Platform:** TryHackMe  

**Vulnerabilities Demonstrated:**
- Cross-Site Scripting (XSS)
- NoSQL Injection
- JWT Token Forgery
- Insecure Direct Object Reference (IDOR)
- Information Disclosure
- Broken Authentication
- Broken Access Control

---

*Happy Hacking! ☕🔐*
