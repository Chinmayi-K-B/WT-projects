// middleware/auth.js
// Optional authentication middleware
const auth = (req, res, next) => {
    // For this assignment, we'll allow all requests. 
    // In a real app, you would check for a token here.
    const token = req.header('x-auth-token');
    
    // Simulating a check (Just logging for now)
    console.log(`[AUTH] Request received from: ${req.ip}`);
    next();
};

module.exports = auth;