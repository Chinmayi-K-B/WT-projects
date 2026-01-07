// server.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // NEW: Import 'path' to handle file paths
const app = express();
const PORT = 5000;

// Import Middleware & Routes
const auth = require('./middleware/auth');
const postsRoutes = require('./routes/posts');

// Global Middleware
app.use(cors()); 
app.use(express.json());
// app.use(auth); // Optional: You can keep auth global or apply it just to API routes below

// --- NEW PART: Serve Static Files ---
// This tells Express to serve files (like index.html) from the current folder
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/posts', auth, postsRoutes);

// Root Route: Send index.html instead of text
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Website is live at http://localhost:${PORT}`);
});