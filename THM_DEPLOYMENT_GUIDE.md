# 🚀 TryHackMe Deployment Guide - BrewMaster Coffee Shop

## Deployment Options

### Option 1: Downloadable File (Recommended)
**Best for:** Self-hosted applications like this Node.js coffee shop

### Option 2: Virtual Machine
**Best for:** Pre-configured environments with multiple tools

**For this challenge, we recommend Option 1 (Downloadable File)** since the application is self-contained and users can run it locally.

---

## Step-by-Step Upload Process

### 1. Prepare Your Content Package

Create a ZIP file containing:
```
BrewMaster-Coffee-Shop.zip
├── app.js                     # Main application file
├── package.json              # Dependencies
├── package-lock.json         # Dependency lock file
├── README.md                 # Setup instructions
├── .env.example              # Environment variables template
├── models/                   # Database models
├── routes/                   # Application routes
├── views/                    # EJS templates
├── public/                   # Static files
├── uploads/                  # File uploads directory
└── SETUP_INSTRUCTIONS.md     # Detailed setup guide
```

### 2. Login to TryHackMe

1. Go to [TryHackMe Room Creation](https://tryhackme.com/room/create)
2. Sign in with your TryHackMe account
3. Click "Create Room"

### 3. Basic Room Information

Fill out the basic details:

**Room Title:** `BrewMaster Coffee Shop`

**Room Description:** 
```
Welcome to BrewMaster Coffee Shop! This web application security challenge tests your skills in vulnerability chaining. Exploit XSS, NoSQL injection, JWT manipulation, and IDOR vulnerabilities to achieve complete system compromise. Perfect for intermediate learners wanting hands-on web security experience.
```

**Room Type:** `Challenge`

**Difficulty:** `Medium`

**Category:** `Web Application Security`

**Tags:** `web, nosql, xss, jwt, idor, burpsuite, vulnchaining`

**Estimated Time:** `45-60 minutes`

### 4. Room Configuration

**Deployment Type:** Select `Downloadable File`

**File Upload:** Upload your prepared ZIP file

**Requirements:**
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Web browser
- Burp Suite (Community edition sufficient)

### 5. Add Tasks

You'll need to add each task individually. For each task:

#### Task 1: Deploy & Discover
- **Task Type:** `None`
- **Title:** `Deploy & Discover`
- **Description:** Copy content from `TASK_1_DEPLOY_DISCOVER.md`
- Add 3 questions with answers and hints

#### Task 2: XSS Discovery
- **Task Type:** `None`
- **Title:** `XSS Discovery`
- **Description:** Copy content from `TASK_2_XSS_DISCOVERY.md`
- Add 2 questions with answers and hints

#### Task 3: NoSQL Injection
- **Task Type:** `None`
- **Title:** `NoSQL Injection`
- **Description:** Copy content from `TASK_3_NOSQL_INJECTION.md`
- Add 2 questions with answers and hints

#### Task 4: JWT Analysis
- **Task Type:** `None`
- **Title:** `JWT Analysis`
- **Description:** Copy content from `TASK_4_JWT_ANALYSIS.md`
- Add 2 questions with answers and hints

#### Task 5: JWT Secret Extraction
- **Task Type:** `None`
- **Title:** `JWT Secret Extraction`
- **Description:** Copy content from `TASK_5_JWT_SECRET_EXTRACTION.md`
- Add 1 question with answer and hint

#### Task 6: Privilege Escalation
- **Task Type:** `None`
- **Title:** `Privilege Escalation`
- **Description:** Copy content from `TASK_6_PRIVILEGE_ESCALATION.md`
- Add 1 question with answer and hint

#### Task 7: IDOR Exploitation
- **Task Type:** `None`
- **Title:** `IDOR Exploitation`
- **Description:** Copy content from `TASK_7_IDOR_EXPLOITATION.md`
- Add 8 questions with answers and hints

#### Task 8: Final Flag
- **Task Type:** `None`
- **Title:** `Final Flag`
- **Description:** Copy content from `TASK_8_FINAL_FLAG.md`
- Add 3 questions with answers and hints

### 6. Setup Instructions for Users

Create a `SETUP_INSTRUCTIONS.md` file to include in your package:

```markdown
# BrewMaster Coffee Shop - Setup Instructions

## Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Web browser (Chrome, Firefox, Edge, etc.)
- Burp Suite Community Edition (optional but recommended)

## Installation Steps

1. **Extract the Files**
   - Extract the downloaded ZIP file to your preferred directory
   - Open a terminal/command prompt in the extracted folder

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Application**
   ```bash
   npm start
   ```

4. **Access the Application**
   - Open your web browser
   - Navigate to: http://localhost:3000
   - You should see the BrewMaster Coffee Shop welcome page

## Default Login Credentials
- **Username:** testuser
- **Password:** password123

## Troubleshooting

### Port 3000 Already in Use
If port 3000 is busy, you can change it:
```bash
PORT=3001 npm start
```
Then access: http://localhost:3001

### Dependencies Installation Issues
If npm install fails:
```bash
npm cache clean --force
npm install
```

### Application Won't Start
- Ensure Node.js is properly installed: `node --version`
- Check if all dependencies installed: `npm list`
- Look for error messages in the terminal

## Tools Recommendations
- **Burp Suite Community:** For request interception and modification
- **Browser Dev Tools:** For inspecting requests and manipulating storage
- **jwt.io:** For JWT token decoding and encoding
- **Base64 Decoder:** Any online Base64 decoder

## Support
If you encounter issues, check the task hints and ensure you're following the vulnerability chain in order.

Happy Hacking! ☕🔐
```

### 7. Room Settings

**Visibility:** Start with `Private` for testing, then make `Public` when ready

**Prerequisites:** List any required knowledge:
- Basic web application knowledge
- HTTP protocol understanding
- Burp Suite familiarity
- JavaScript basics

**Learning Path:** You can add this to relevant learning paths later

### 8. Testing Phase

Before making public:

1. **Test the Download:** Ensure ZIP file downloads correctly
2. **Test Setup:** Follow your own setup instructions
3. **Test All Tasks:** Complete each task to verify answers
4. **Check Points:** Ensure point values are appropriate
5. **Review Content:** Check for typos and clarity

### 9. Publication

Once everything is tested:

1. Change visibility to `Public`
2. Add to relevant learning paths
3. Share on social media/Discord
4. Monitor for user feedback

---

## Tips for Success

### Content Quality
- ✅ Clear, concise task descriptions
- ✅ Helpful but not revealing hints
- ✅ Realistic point values
- ✅ Progressive difficulty curve

### Technical Quality
- ✅ Application starts without errors
- ✅ All vulnerabilities work as intended
- ✅ Answers are correct and consistent
- ✅ Setup instructions are complete

### User Experience
- ✅ Logical task progression
- ✅ Appropriate difficulty for skill level
- ✅ Educational value
- ✅ Engaging storyline/theme

---

## Submission Checklist

Before submitting your room:

- [ ] ZIP file contains all necessary files
- [ ] Setup instructions are clear and complete
- [ ] All 8 tasks are properly configured
- [ ] All questions have correct answers
- [ ] All hints are helpful but not revealing
- [ ] Application runs without errors
- [ ] All vulnerabilities are exploitable
- [ ] Point values total 280 as planned
- [ ] Room description is engaging
- [ ] Tags and categories are appropriate

---

## Post-Publication

### Monitor Performance
- Check completion rates
- Read user reviews and feedback
- Monitor Discord/forums for discussions
- Track any reported issues

### Continuous Improvement
- Update based on user feedback
- Fix any discovered bugs
- Add clarifications if needed
- Consider creating follow-up content

### Community Engagement
- Respond to user questions
- Participate in discussions
- Share solving tips (after sufficient time)
- Create writeups or video walkthroughs

---

**Good luck with your room submission!** 🚀

Remember: The goal is to create an educational, engaging experience that teaches real-world security concepts while being challenging but fair.