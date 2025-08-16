const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        error: 'No authorization token provided' 
      });
    }

    // Extract token from header
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid authorization token format' 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }

    // Find user with token
    const user = await User.findOne({ 
      _id: decoded._id, 
      'tokens.token': token 
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found or token invalid' 
      });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during authentication' 
    });
  }
};