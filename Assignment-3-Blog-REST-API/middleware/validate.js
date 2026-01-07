// middleware/validate.js
const validatePost = (req, res, next) => {
    const { title, content, category } = req.body;

    if (!title || !content) {
        return res.status(400).json({ 
            success: false, 
            message: "Title and Content are required fields." 
        });
    }

    // Set default category if missing
    if (!category) {
        req.body.category = "General";
    }

    next();
};

module.exports = validatePost;