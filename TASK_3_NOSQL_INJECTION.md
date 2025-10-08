# Task 3 - NoSQL Injection
3. **🔍 Analyze Request Structure**sk Configuration

**Type:** None  
**AttackBox or VPN enabled:** No  
**Title:** NoSQL Injection  
**Objective:** Exploit authentication system using NoSQL injection  
**Release date:** Instant  
**End date:** Not set  

---

## Task Content

### Introduction

Exploit the authentication system using NoSQL injection techniques.

### What You'll Learn

- NoSQL injection attacks
- Authentication bypass
- Request interception and modification

## Instructions 📋

Use Burp Suite to intercept login requests, test for NoSQL injection vulnerabilities, and target the user mentioned in Task 2.

2. **� Intercept Authentication Requests**
   • Navigate to the login page and attempt authentication
   • Capture the login request in Burp Suite
   • Analyze the request structure and format

## Expected Outcome ✅

Successfully bypass authentication and obtain privileged access with special keys.

## 🛡️ Security Note

NoSQL injection can lead to authentication bypass, data extraction, and privilege escalation. Always ensure proper input validation and parameterized queries in production applications.

---

## Questions, Answers & Hints

### Question 1

**Question:** What is the username of the privileged user you discovered through NoSQL injection?  
**Answer Format:** Text  
**Answer:** admin  
**Points:** 20  
**Hint:** Use Burp Suite to intercept login requests. Target the user mentioned in the XSS alert from Task 2. Use MongoDB operators like $ne (not equal).

### Question 2

**Question:** What is the XSS key provided in the response after successfully targeting this user? (Format: XxxxxXxxxxxXxxxxxxXxxx)  
**Answer Format:** Text  
**Answer:** XssKeyForConfigAccess  
**Points:** 25  
**Hint:** After successfully performing NoSQL injection, examine the response body carefully. Look for a special key that might be used for XSS or further exploitation.

---

## Additional Information

## Additional Information 📚

1. **📋 Prerequisites**
   • Completion of Tasks 1 and 2
   • Burp Suite Community or Professional
   • Understanding of HTTP requests and JSON
   • Basic knowledge of NoSQL databases

2. **🔧 Tools Required**
   • Burp Suite
   • Web browser configured with Burp proxy
   • Knowledge of MongoDB query operators

3. **📝 Common NoSQL Operators**
   • `$ne`: Not equal
   • `$gt`: Greater than
   • `$regex`: Regular expression matching
   • `$where`: JavaScript expression

4. **⏱️ Estimated Time**
   • 15-20 minutes

5. **📊 Difficulty**
   • Intermediate

## Next Steps ➡️

The XSS key you obtain in this task will be crucial for Task 5, where you'll use it to extract the JWT secret. The privileged user access will also be important for subsequent tasks.