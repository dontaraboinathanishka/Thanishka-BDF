# Lab 01: Introduction to Express.js & Route Creation

## Student Identity
- **Student Name:** D. Thanishka
- **Registration Number:** 252U1R5039
- **Section:** CSE (AI & DE)
- **Course:** Backend Development Frameworks

---

## 1. Objective
To build, configure, and deploy a basic Node.js and Express.js web server handling custom HTTP GET routes, managing academic identity endpoints, returning structured JSON responses for valid and invalid paths, and publishing the live web application on Render.

---

## 2. Project Description
This project demonstrates the creation of a foundational web server using Node.js and Express.js for Lab 01 of the Backend Development Frameworks course. It features four distinct API endpoints that respond with text and JSON structures, custom 404 error handling for undefined routes, complete local screenshot documentation, and live deployment on Render.

---

## 3. Technologies Used
- **Runtime Environment:** Node.js
- **Web Framework:** Express.js
- **Development Tools:** Nodemon
- **Deployment Platform:** Render
- **Version Control:** Git & GitHub

---

## 4. Project Structure

```text
Thanishka-BDF/
└── lab-01/
    ├── node_modules/
    ├── screenshots/
    │   ├── home.png
    │   ├── about.png
    │   ├── time.png
    │   └── unknown.png
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── README.md
    └── server.js
5. API Endpoints
Local Base URL: http://localhost:3000

Live Base URL: https://thanishka-lab-1.onrender.com

HTTP Method	Endpoint	Description
GET	/	Returns welcome message
GET	/about	Returns student identity details in JSON format
GET	/time	Returns current server timestamp in JSON format
GET	/* (Invalid Path)	Returns custom 404 Error message in JSON format

6. Screenshots
GET / - Home Route
GET /about - About Route
GET /time - Time Route
GET /invalid-path - 404 Error Route
7. Execution & Running Locally
Clone the repository:

Bash


git clone <THANISHKA_GITHUB_REPO_URL>
cd Thanishka-BDF/lab-01
Install dependencies:

Bash


npm install
Start the development server with Nodemon:

Bash


npm run dev
Access endpoints in your browser:
Navigate to http://localhost:3000/.

8. Deployment
The application is deployed live on Render:

Deployment Platform: Render

Live Base URL: https://thanishka-lab-1.onrender.com


---

### Step 5: Add Screenshots & Create `.gitignore`

1. Create a `.gitignore` file inside `lab-01`:
   ```text
   node_modules/
   .env
Save your 4 route screenshots inside Thanishka-BDF/lab-01/screenshots/:

home.png

about.png

time.png

unknown.png

Step 6: Git Push to Her Repository
Make sure your terminal is inside C:\Users\bhagy\OneDrive\Desktop\Thanishka-BDF (or lab-01):
# Initialize git if not already done in the root folder
git init
git branch -M main

# Connect to her repository using her PAT to bypass 403 authorization issues
git remote add origin https://<THANISHKA_PAT>@github.com/<THANISHKA_USERNAME>/<THANISHKA_REPO_NAME>.git

# Add, commit, and push
git add .
git commit -m "feat: setup lab-01 express server and README documentation for D. Thanishka"
git push -u origin main