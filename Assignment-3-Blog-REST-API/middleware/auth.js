function auth(req, res, next) {
  const token = req.headers["authorization"];

  if (!token || token !== "Bearer admin123") {
    return res.status(401).json({
      error: "Unauthorized access"
    });
  }

  next();
}

module.exports = auth;
