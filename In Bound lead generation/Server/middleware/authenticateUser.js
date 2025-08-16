const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function authenticateUser(req, res, next) {
  try {
    // Log all headers
    console.log('🛡 Checking Authorization header:', req.headers.authorization);

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No Authorization header or wrong format');
      return res.status(401).json({ error: 'Please authenticate (No token)' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Extracted Token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded token:', decoded);

    req.user = { _id: decoded.id }; // Save user info to request object
    next();

  } catch (error) {
    console.error('❌ Token validation error:', error.message);
    return res.status(401).json({ error: 'Please authenticate (Token invalid or expired)', details: error.message });
  }
};
