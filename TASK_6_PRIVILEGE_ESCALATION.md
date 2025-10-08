# Task 6 - Privilege Escalation

## Task Configuration

**Type:** None  
**AttackBox or VPN enabled:** No  
**Title:** Privilege Escalation  
**Objective:** Forge admin JWT tokens for privilege escalation  
**Release date:** Instant  
**End date:** Not set  

---

## Task Content

### Introduction

Forge admin JWT tokens using the extracted secret for privilege escalation.

### What You'll Learn

- JWT token forgery
- Privilege escalation techniques
- Browser storage manipulation

## Instructions 📋

Decode your current JWT token, modify it to gain admin privileges, re-sign with the extracted secret, and update browser storage.

## Expected Outcome ✅

Successfully forge admin tokens and gain administrative access.

## 🛡️ Security Note

JWT token forgery is possible when secrets are weak or exposed. Always use strong, randomly generated secrets and store them securely. Implement proper access control checks on the server side.

---

## Questions, Answers & Hints

### Question 1

**Question:** After forging an admin token and accessing the admin dashboard, what is the admin flag? (Format: flag{xxxxx_xxxxx_xxxxx})  
**Answer Format:** flag{...}  
**Answer:** flag{admin_access_granted}  
**Points:** 35  
**Hint:** 
1. Go to jwt.io
2. Decode your current token
3. Change the role to "admin"
4. Sign with the JWT secret from Task 5
5. Update localStorage and cookies
6. Access /admin/dashboard

---

## Additional Information

## Additional Information 📚

1. **📋 Prerequisites**
   • Completion of Tasks 1-5
   • JWT secret from Task 5
   • Current valid JWT token
   • Browser developer tools knowledge

2. **🔧 Tools Required**
   • Web browser with developer tools
   • Access to jwt.io
   • JWT secret from previous task

3. **📝 Token Update Commands**
   ```javascript
   // Update localStorage
   localStorage.setItem('jwt_token', 'YOUR_FORGED_JWT');
   
   // Update cookies
   document.cookie = 'token=YOUR_FORGED_JWT; path=/; SameSite=Lax';
   
   // Reload page
   location.reload();
   ```

4. **⏱️ Estimated Time**
   • 15-20 minutes

5. **📊 Difficulty**
   • Intermediate

## Next Steps ➡️

With administrative access, you'll be able to explore the admin panel and discover the file server functionality needed for Task 7, where you'll exploit IDOR vulnerabilities.