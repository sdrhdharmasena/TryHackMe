# Task 5 - JWT Secret Extraction

## Task Configuration

**Type:** None  
**AttackBox or VPN enabled:** No  
**Title:** JWT Secret Extraction  
**Objective:** Extract the JWT signing secret from the application  
**Release date:** Instant  
**End date:** Not set  

---

## Task Content

### Introduction

Extract the JWT signing secret using the XSS key from Task 3.

### What You'll Learn

- Secret extraction techniques
- Configuration endpoint enumeration
- XSS key utilization

## Instructions 📋

Use the XSS key to access configuration endpoints and extract the JWT signing secret from exposed environment variables.

## Expected Outcome ✅

Successfully extract the JWT signing secret using the XSS key.

## 🛡️ Security Note

Exposing JWT secrets or configuration through accessible endpoints is a critical security vulnerability. Always ensure sensitive information is properly protected and never exposed through web endpoints.

---

## Questions, Answers & Hints

### Question 1

**Question:** What is the JWT secret used by the server? (If you can't extract it directly, check the environment or configuration)  
**Answer Format:** Text  
**Answer:** super_secret_key_2024  
**Points:** 30  
**Hint:** The XSS key might unlock access to configuration endpoints or reveal secrets through specially crafted payloads. Look for exposed API endpoints or configuration files that might contain JWT_SECRET.

---

## Additional Information

## Additional Information 📚

1. **📋 Prerequisites**
   • Completion of Tasks 1, 2, 3, and 4
   • XSS key from Task 3
   • Understanding of web application endpoints

2. **🔧 Tools Required**
   • Web browser
   • XSS key from previous task
   • URL manipulation skills

3. **📊 Common Secret Exposure Points**
   • Configuration endpoints
   • Environment variable dumps
   • Debug/development endpoints
   • Error messages with stack traces
   • Source code comments

4. **⏱️ Estimated Time**
   • 15-20 minutes

5. **📊 Difficulty**
   • Intermediate

## Next Steps ➡️

The JWT secret you extract in this task is crucial for Task 6, where you'll use it to forge an admin token and escalate your privileges to access the administrative dashboard.