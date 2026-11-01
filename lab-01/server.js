const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Home Route
app.get('/', (req, res) => {
    res.send('Welcome to Node.js & Express.js Lab Server!');
});


// About Route - Student Details
app.get('/about', (req, res) => {
    res.json({
        name: "D. Thanishka",
        registerNumber: "252U1R5039",
        section: "CSE (AI & DE)",
        course: "Backend Development Frameworks"
    });
});

// Time Route
app.get('/time', (req, res) => {
    res.json({
        currentTime: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: "404 Not Found",
        message: "The requested route does not exist."
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
