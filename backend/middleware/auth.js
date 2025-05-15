
const jwt = require('jsonwebtoken');

/**
 * Authentication middleware for API routes
 * Verifies the JWT token and adds the user data to the request object
 */
const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If no token, return unauthorized
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;
