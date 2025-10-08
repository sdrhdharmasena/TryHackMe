# Task 4 - JWT Analysis

## Task Configuration

**Type:** None  
**AttackBox or VPN enabled:** No  
**Title:** JWT Analysis  
**Objective:** Analyze JWT tokens for structure and security  
**Release date:** Instant  
**End date:** Not set  

---

## Task Content

### Introduction

Analyze JWT tokens for structure and security information.

### What You'll Learn

- JWT token structure
- Token decoding and analysis
- Algorithm identification

## Instructions 📋

Locate your JWT token, decode it using appropriate tools, and analyze the header, payload, and timing information.

## Expected Outcome ✅

Successfully decode and analyze JWT token structure and timing.

## 🛡️ Security Note

JWT tokens should use strong signing algorithms and have appropriate expiration times. Weak algorithms or overly long expiration periods can lead to security vulnerabilities.

---

## Questions, Answers & Hints

### Question 1

**Question:** What is the name of the algorithm used to sign the JWT tokens? (Uppercase)  
**Answer Format:** Text  
**Answer:** HS256  
**Points:** 15  
**Hint:** Use jwt.io to decode your token. Check the header section for the algorithm (alg) field. The answer should be in uppercase format.

### Question 2

**Question:** How many hours is the token valid for?  
**Answer Format:** Number  
**Answer:** 24  
**Points:** 10  
**Hint:** Check the payload section for iat (issued at) and exp (expiration) timestamps. Calculate the difference and convert from seconds to hours.

---

## Additional Information

## Additional Information 📚

1. **📋 Prerequisites**
   • Completion of Tasks 1, 2, and 3
   • Valid JWT token from previous task
   • Basic understanding of timestamps and time calculations

2. **🔧 Tools Required**
   • Web browser
   • Access to jwt.io or similar JWT decoder
   • Calculator for timestamp differences

3. **📝 JWT Structure**
   ```
   header.payload.signature
   ```

4. **📊 Common JWT Claims**
   • `iss`: Issuer
   • `sub`: Subject
   • `aud`: Audience
   • `exp`: Expiration time
   • `iat`: Issued at
   • `nbf`: Not before

5. **⏱️ Estimated Time**
   • 10-15 minutes

6. **📊 Difficulty**
   • Beginner to Intermediate

## Next Steps ➡️

Understanding the JWT structure and algorithm will be essential for Task 6, where you'll forge admin tokens. The algorithm information is particularly important for the token forgery process.