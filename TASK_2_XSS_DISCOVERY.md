# Task 2 - XSS Discovery

## Task Configuration

**Type:** None  
**AttackBox or VPN enabled:** No  
**Title:** XSS Discovery  
**Objective:** Identify and exploit Cross-Site Scripting vulnerabilities  
**Release date:** Instant  
**End date:** Not set  

---

## Task Content

### Introduction

Explore the application for Cross-Site Scripting vulnerabilities.

### What You'll Learn

- XSS vulnerability identification
- Script injection techniques
- Information gathering through XSS

## Instructions 📋

Navigate to the coffee menu, test the search functionality for XSS vulnerabilities, and analyze any alert messages.

## Expected Outcome ✅

Successfully identify XSS vulnerabilities and gather important information.

## 🛡️ Security Note

XSS vulnerabilities can be used to steal cookies, session tokens, and perform actions on behalf of other users. In real applications, this could lead to account takeover and data theft.

---

## Questions, Answers & Hints

### Question 1

**Question:** What is the name mentioned in the XSS alert message? (One word)  
**Answer Format:** Text  
**Answer:** admin  
**Points:** 15  
**Hint:** Try injecting script tags in the search box. Pay attention to any custom alert messages that appear when your XSS payload executes.

### Question 2

**Question:** According to the hint, who "holds all the secrets"?  
**Answer Format:** Text  
**Answer:** admin  
**Points:** 10  
**Hint:** Look carefully at the content of the XSS alert message. There should be a reference to someone who has administrative access or important information.

---

## Additional Information

## Additional Information 📚

1. **📋 Prerequisites**
   • Completion of Task 1
   • Basic understanding of HTML and JavaScript
   • Knowledge of XSS attack vectors

2. **🔧 Tools Required**
   • Web browser with developer tools
   • Basic knowledge of HTML/JavaScript injection

3. **⏱️ Estimated Time**
   • 10-15 minutes

4. **📊 Difficulty**
   • Beginner to Intermediate

## Next Steps ➡️

The information you discover in this task will be crucial for Task 3, where you'll use NoSQL injection to target specific users mentioned in the XSS alerts.

💡 Keep note of any usernames or hints you discover!