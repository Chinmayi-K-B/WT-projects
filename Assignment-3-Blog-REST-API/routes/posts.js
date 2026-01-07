// routes/posts.js
const express = require('express');
const router = express.Router();
const validatePost = require('../middleware/validate');

// In-memory database (Array)
let posts = [
    {
        id: 1,
        title: "Web Technology",
        content: "Today learning React and Node.js connectivity.",
        category: "Work",
        timestamp: new Date().toLocaleString()
    },
    {
        id: 2,
        title: "Welcome Note",
        content: "Hey, I edited this note successfully!",
        category: "General",
        timestamp: new Date().toLocaleString()
    }
];

// GET: Fetch all posts
router.get('/', (req, res) => {
    res.json(posts);
});

// POST: Create a new post
router.post('/', validatePost, (req, res) => {
    const newPost = {
        id: Date.now(),
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        timestamp: new Date().toLocaleString()
    };
    posts.unshift(newPost); // Add to top
    res.status(201).json(newPost);
});

// PUT: Update a post
router.put('/:id', validatePost, (req, res) => {
    const postId = parseInt(req.params.id);
    const index = posts.findIndex(p => p.id === postId);

    if (index === -1) return res.status(404).json({ message: "Post not found" });

    posts[index] = {
        ...posts[index],
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        timestamp: new Date().toLocaleString() // Update time
    };

    res.json(posts[index]);
});

// DELETE: Delete a post
router.delete('/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== postId);
    res.json({ message: "Deleted successfully" });
});

module.exports = router;