# ☕ BrewMaster Coffee Shop - Answer Key (Room Creator Only)

## ⚠️ CONFIDENTIAL - FOR ROOM CREATORS ONLY ⚠️

This document contains all the answers for the TryHackMe room. Keep this secure and do not share with participants.

---

## Task 1 - Deploy & Discover

### Question 1: What is the first name of the test user after logging in?
**Answer:** `Test` (or based on your database seed)  
**Points:** 10

**Solution Path:**
1. Login with testuser/password123
2. Check profile page or navbar greeting
3. User's first name is displayed

---

## Task 2 - XSS Discovery

### Question 1: What is the name mentioned in the XSS alert message?
**Answer:** `Dio`  
**Points:** 15

### Question 2: According to the hint, who "holds all the secrets"?
**Answer:** `Dio`  
**Points:** 10

**Solution Path:**
1. Navigate to /coffee
2. Enter XSS payload in search: `<script>alert('test')</script>`
3. Alert displays: "Dio holds all the secrets"
4. This is a hint for the next task

**Total Points:** 25

---

## Task 3 - NoSQL Injection

### Question 1: What is the username of the privileged user you discovered?
**Answer:** `Dio`  
**Points:** 20

### Question 2: What is the XSS key provided in the response?
**Answer:** `DioBrandoSecretKey2025`  
**Points:** 25

**Solution Path:**
1. Open Burp Suite and configure browser proxy
2. Intercept POST request to /auth/login
3. First attempt with basic NoSQL injection:
   ```json
   {"username": {"$ne": null}, "password": {"$ne": null}}
   ```
4. Response hints to target Dio specifically
5. Second attempt targeting Dio:
   ```json
   {"username": "Dio", "password": {"$ne": null}}
   ```
6. Response contains:
   - JWT token for Dio
   - XSS key: DioBrandoSecretKey2025
   - User information

**Total Points:** 45

---

## Task 4 - JWT Analysis

### Question 1: What is the algorithm used to sign JWT tokens?
**Answer:** `HS256`  
**Points:** 15

### Question 2: How many hours is the token valid for?
**Answer:** `1` (or `24` depending on endpoint used)  
**Points:** 10

**Solution Path:**
1. Go to jwt.io
2. Paste JWT token from login
3. Header shows: `"alg": "HS256"`
4. Payload shows iat and exp timestamps
5. Calculate: (exp - iat) / 3600 = hours
6. Standard login: 1 hour, /auth/login endpoint: 24 hours

**Total Points:** 25

---

## Task 5 - JWT Secret Extraction

### Question 1: What is the JWT secret used by the server?
**Answer:** (Based on your .env file - example: `coffee_shop_secret_2025`)  
**Points:** 30

**Solution Path:**
Multiple approaches:
1. **Environment Variable Exposure:**
   - Check for exposed /api/config or similar endpoints
   - Use XSS key from Task 3 to access protected endpoints
   
2. **Source Code Analysis:**
   - Check for hardcoded secrets in client-side code
   - Look for .env files in public directories

3. **Brute Force (if weak):**
   - Use tools like jwt_tool or hashcat
   - Common secrets: secret, test, coffee, etc.

**Note:** Update this answer based on your actual JWT_SECRET in .env file

**Total Points:** 30

---

## Task 6 - Privilege Escalation

### Question 1: What is the admin flag on the dashboard?
**Answer:** `flag{admin_dashboard_accessed}`  
**Points:** 35

**Solution Path:**
1. Get current JWT token from localStorage
2. Go to jwt.io
3. Decode token and modify payload:
   ```json
   {
     "userId": "keep_original",
     "username": "keep_original",
     "role": "admin",  // Changed from "user"
     "iat": "keep_original",
     "exp": "keep_original"
   }
   ```
4. Enter JWT secret in signature section
5. Copy the new forged token
6. Execute in browser console:
   ```javascript
   localStorage.setItem('jwt_token', 'FORGED_TOKEN');
   document.cookie = 'token=FORGED_TOKEN; path=/; SameSite=Lax';
   location.reload();
   ```
7. Navigate to /admin/dashboard
8. Flag is displayed in golden section

**Total Points:** 35

---

## Task 7 - IDOR Exploitation

### Question 1: How many files are accessible through the file server?
**Answer:** `5`  
**Points:** 20

### Question 2: What is the file ID of the secret administrative backup?
**Answer:** `5`  
**Points:** 15

### Question 3: What is the CTF flag found in the secret file?
**Answer:** `You_Found_The_Secret_File!`  
**Points:** 30

**Solution Path:**
1. From admin dashboard, note file server section
2. Click "View File 1" - URL is /admin/files/1
3. Enumerate by changing ID parameter:
   - /admin/files/1 - company_overview.txt
   - /admin/files/2 - sales_report.txt
   - /admin/files/3 - employee_directory.txt
   - /admin/files/4 - marketing_plan.txt
   - /admin/files/5 - secret_admin_backup.txt (SECRET!)
4. File 5 contains:
   - CTF Flag: You_Found_The_Secret_File!
   - Base64 encoded string for next task

**Total Points:** 65

---

## Task 8 - Final Flag

### Question 1: What is the domain name in the decoded URL?
**Answer:** `www.youtube.com`  
**Points:** 25

### Question 2: What is the video ID in the YouTube URL?
**Answer:** `dQw4w9WgXcQ`  
**Points:** 20

### Question 3: What popular internet meme did you just encounter?
**Answer:** `Rickroll` (or `rickrolling`)  
**Points:** 10

**Solution Path:**
1. Get Base64 string from file ID 5:
   ```
   aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUSZsaXN0PVJEZFF3NHc5V2dYY1E=
   ```

2. Decode using online tool or command line:
   
   **Linux/Mac:**
   ```bash
   echo "aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUSZsaXN0PVJEZFF3NHc5V2dYY1E=" | base64 -d
   ```
   
   **Windows PowerShell:**
   ```powershell
   [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUSZsaXN0PVJEZFF3NHc5V2dYY1E="))
   ```

3. Decoded result:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ
   ```

4. Extract answers:
   - Domain: www.youtube.com
   - Video ID: dQw4w9WgXcQ
   - Meme: Rickroll (Rick Astley's "Never Gonna Give You Up")

**Total Points:** 55

---

## Complete Answer Summary

### All Answers at a Glance

**Task 1:**
1. Test (or based on DB)

**Task 2:**
1. Dio
2. Dio

**Task 3:**
1. Dio
2. DioBrandoSecretKey2025

**Task 4:**
1. HS256
2. 1 (or 24)

**Task 5:**
1. [Your JWT_SECRET from .env]

**Task 6:**
1. flag{admin_dashboard_accessed}

**Task 7:**
1. 5
2. 5
3. You_Found_The_Secret_File!

**Task 8:**
1. www.youtube.com
2. dQw4w9WgXcQ
3. Rickroll

---

## Total Points: 280

---

## Testing Checklist for Room Creator

Before publishing the room, verify:

- [ ] Application deploys successfully
- [ ] Test user credentials work (testuser/password123)
- [ ] XSS payload triggers custom alert
- [ ] NoSQL injection returns XSS key
- [ ] JWT tokens can be decoded at jwt.io
- [ ] JWT secret allows token forgery
- [ ] Admin dashboard displays flag
- [ ] All 5 files accessible via IDOR
- [ ] File 5 contains correct flag and Base64 string
- [ ] Base64 decodes to YouTube rickroll URL
- [ ] All questions have clear, testable answers

---

## Common Issues & Solutions

### Issue 1: JWT Secret Not Working
**Solution:** Ensure JWT_SECRET in .env matches what you provide as the answer

### Issue 2: IDOR Not Working
**Solution:** Verify files 1-5 exist in public/files/ directory

### Issue 3: NoSQL Injection Blocked
**Solution:** Check Content-Type is application/json in Burp Suite

### Issue 4: Admin Access Denied
**Solution:** Ensure role is exactly "admin" (lowercase) in JWT payload

### Issue 5: XSS Not Executing
**Solution:** Verify <%- unsafeSearch %> is used in menu.ejs (not <%= %>)

---

## Room Configuration Notes

**Recommended VM Settings:**
- RAM: 2GB minimum
- Disk: 10GB
- Network: NAT with port 3000 exposed

**Environment Variables Required:**
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/coffee-shop
JWT_SECRET=coffee_shop_secret_2025
NODE_ENV=production
```

**Database Seeding:**
Ensure these users exist:
- testuser (role: user) - password: password123
- Dio (role: user) - password: [any]
- admin (role: admin) - password: [for testing]

**Files Required:**
```
public/files/
├── company_overview.txt
├── sales_report.txt
├── employee_directory.txt
├── marketing_plan.txt
└── secret_admin_backup.txt
```

---

## Support Information

If participants encounter issues:
1. Check application is running on port 3000
2. Verify Burp Suite proxy settings
3. Ensure browser allows cookies and localStorage
4. Check Developer Tools console for errors
5. Restart the machine if needed

**Common Hints to Provide:**
- Task 2: "Try common XSS payloads with script tags"
- Task 3: "MongoDB uses operators like $ne, $gt, etc."
- Task 5: "Check your .env file or exposed endpoints"
- Task 7: "IDs are sequential numbers, not random"

---

**Last Updated:** October 1, 2025  
**Room Version:** 1.0  
**Creator:** [Your Name]
