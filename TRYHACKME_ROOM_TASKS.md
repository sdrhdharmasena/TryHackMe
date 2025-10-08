# ☕ BrewMaster Coffee Shop - TryHackMe Challenge

## Room Overview

**Room Name:** BrewMaster Coffee Shop  
**Room Type:** Challenge  
**Difficulty:** Medium  
**Category:** Web Application Security  
**Tags:** #web #nosql #xss #jwt #idor #burpsuite  

### Description

Welcome to BrewMaster Coffee Shop! This web application is a modern coffee ordering platform that contains several security vulnerabilities. Your mission is to exploit these vulnerabilities to gain unauthorized access and capture all the flags.

You'll need to chain multiple vulnerabilities together to achieve complete system compromise. This challenge will test your skills in web application security, including XSS, NoSQL injection, JWT manipulation, and access control vulnerabilities.

**Learning Objectives:**
- Identify and exploit Cross-Site Scripting (XSS) vulnerabilities
- Perform NoSQL injection attacks
- Manipulate JWT tokens for privilege escalation
- Exploit Insecure Direct Object References (IDOR)
- Chain multiple vulnerabilities for complete compromise

**Prerequisites:**
- Basic understanding of web applications
- Familiarity with Burp Suite
- Knowledge of HTTP requests and responses
- Basic JavaScript knowledge

---

## Starting Point

**Application URL:** Deploy the machine and access the application at:
```
http://MACHINE_IP:3000
```

**Provided Credentials:**
```
Username: testuser
Password: password123
```

Use these credentials to get started with the challenge.

---

## Tasks

### Task 1 - Deploy & Discover

**Question 1:** What is the first name of the test user after logging in?  
**Answer Format:** Text  
**Points:** 10

**Hint:** Login with the provided credentials and explore your profile.

---

### Task 2 - XSS Discovery

The coffee menu has a search functionality. Test this feature for potential vulnerabilities.

**Question 1:** What is the name mentioned in the XSS alert message? (One word)  
**Answer Format:** Text  
**Points:** 15

**Question 2:** According to the hint, who "holds all the secrets"?  
**Answer Format:** Text  
**Points:** 10

**Hint:** Try injecting script tags in the search box. Pay attention to any custom alert messages.

---

### Task 3 - NoSQL Injection

Time to exploit the authentication system. You'll need Burp Suite for this task.

**Question 1:** What is the username of the privileged user you discovered through NoSQL injection?  
**Answer Format:** Text  
**Points:** 20

**Question 2:** What is the XSS key provided in the response after successfully targeting this user? (Format: XxxxxXxxxxxXxxxxxxXxxx)  
**Answer Format:** Text  
**Points:** 25

**Hint:** Use Burp Suite to intercept login requests. MongoDB uses operators like $ne (not equal). Try targeting the user from Task 2.

**NoSQL Injection Example:**
```json
{
  "username": "TARGET_USER",
  "password": {"$ne": null}
}
```

---

### Task 4 - JWT Analysis

Now that you have a valid JWT token, it's time to analyze it.

**Question 1:** What is the name of the algorithm used to sign the JWT tokens? (Uppercase)  
**Answer Format:** Text  
**Points:** 15

**Question 2:** How many hours is the token valid for?  
**Answer Format:** Number  
**Points:** 10

**Hint:** Use jwt.io to decode your token. Check the header for the algorithm and calculate the time difference between iat and exp.

---

### Task 5 - JWT Secret Extraction

The XSS key you obtained earlier might be useful for extracting sensitive information.

**Question 1:** What is the JWT secret used by the server? (If you can't extract it directly, check the environment or configuration)  
**Answer Format:** Text  
**Points:** 30

**Hint:** The XSS key might unlock access to configuration endpoints or reveal secrets through specially crafted payloads. Look for exposed API endpoints or configuration files.

---

### Task 6 - Privilege Escalation

Use the JWT secret to forge an admin token and escalate your privileges.

**Question 1:** After forging an admin token and accessing the admin dashboard, what is the admin flag? (Format: flag{xxxxx_xxxxx_xxxxx})  
**Answer Format:** flag{...}  
**Points:** 35

**Hint:** 
1. Go to jwt.io
2. Decode your current token
3. Change the role to "admin"
4. Sign with the JWT secret from Task 5
5. Update localStorage and cookies
6. Access /admin/dashboard

**Commands to set the token:**
```javascript
localStorage.setItem('jwt_token', 'YOUR_FORGED_JWT');
document.cookie = 'token=YOUR_FORGED_JWT; path=/; SameSite=Lax';
location.reload();
```

---

### Task 7 - IDOR Exploitation

The admin panel has a file server. Time to enumerate!

**Question 1:** How many files are accessible through the file server?  
**Answer Format:** Number  
**Points:** 20

**Question 2:** What is the file ID of the secret administrative backup file?  
**Answer Format:** Number  
**Points:** 15

**Question 3:** What is the CTF flag found in the secret file? (Format: You_Xxxxx_Xxx_Xxxxxx_Xxxx!)  
**Answer Format:** Text  
**Points:** 30

**Hint:** The admin dashboard shows file access through /admin/files/{id}. File IDs are sequential. The dashboard only shows file ID 1, but hints that there might be more files...

**IDOR Testing:**
```
/admin/files/1
/admin/files/2
/admin/files/3
/admin/files/4
/admin/files/5
```

---

### Task 8 - Final Flag

The secret administrative file contains an encoded message.

**Question 1:** Decode the Base64 string found in the secret file. What is the domain name in the decoded URL? (Format: xxx.xxxxxx.xxx)  
**Answer Format:** Text  
**Points:** 25

**Question 2:** What is the video ID in the decoded YouTube URL? (The part after v=)  
**Answer Format:** Text  
**Points:** 20

**Question 3:** You've been tricked! What popular internet meme did you just encounter?  
**Answer Format:** Text (one word)  
**Points:** 10

**Hint:** Use a Base64 decoder on the string found in file ID 5. You can use online tools or command line:

**Linux/Mac:**
```bash
echo "BASE64_STRING" | base64 -d
```

**Windows PowerShell:**
```powershell
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("BASE64_STRING"))
```

---

## Summary

Congratulations! You've completed the BrewMaster Coffee Shop challenge!

**Skills Practiced:**
- Web application reconnaissance
- Cross-Site Scripting (XSS) exploitation
- NoSQL injection techniques
- JWT token analysis and manipulation
- Privilege escalation through token forgery
- Insecure Direct Object Reference (IDOR) exploitation
- Base64 encoding/decoding
- Vulnerability chaining

**Vulnerabilities Discovered:**
1. ✅ Reflected XSS in search functionality
2. ✅ NoSQL injection in authentication
3. ✅ Plaintext password storage
4. ✅ JWT secret exposure
5. ✅ Insecure JWT validation
6. ✅ Broken access control (IDOR)
7. ✅ Information disclosure
8. ✅ Missing authorization checks

**Total Points:** 280

---

## Additional Information

### Tools Used
- **Burp Suite** - For intercepting and modifying HTTP requests
- **Browser DevTools** - For JavaScript execution and token manipulation
- **jwt.io** - For JWT decoding and encoding
- **Base64 Decoder** - For decoding the final flag

### Mitigation Recommendations

**For XSS:**
- Implement proper input validation and output encoding
- Use Content Security Policy (CSP) headers
- Sanitize all user input before rendering

**For NoSQL Injection:**
- Use parameterized queries
- Validate input types server-side
- Implement proper input sanitization

**For JWT Security:**
- Use strong, random secrets (minimum 256 bits)
- Store secrets securely in environment variables
- Implement token expiration and rotation
- Validate tokens properly on every request

**For IDOR:**
- Implement proper authorization checks for each resource
- Use UUIDs instead of sequential IDs
- Validate user permissions before granting access
- Follow the principle of least privilege

### Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP NoSQL Injection](https://owasp.org/www-community/Injection_Flaws)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)

---

## Author Notes

This challenge demonstrates how multiple vulnerabilities can be chained together to achieve complete system compromise. In real-world scenarios, defense in depth is crucial - one vulnerability should never lead to total system takeover.

The vulnerabilities in this application are intentional and designed for educational purposes. Never attempt these techniques on systems you don't own or have explicit permission to test.

Happy Hacking! ☕🔐

---

**Created by:** [Your Name]  
**Difficulty:** Medium  
**Estimated Time:** 45-60 minutes  
**Category:** Web Security  
**Points:** 280
