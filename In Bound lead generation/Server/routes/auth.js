const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');


// Signup
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    
    const { name, email, phone, password } = req.body;

    // Input validation
    if (!name || !email || !phone || !password) {
      console.log('Missing required fields:', { name, email, phone, password });
      return res.status(400).json({ 
        success: false, 
        error: "Name, email, phone, and password are required" 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ 
        success: false, 
        error: "Invalid email format" 
      });
    }

    // Password length validation
    if (password.length < 6) {
      console.log('Password too short:', password.length);
      return res.status(400).json({ 
        success: false, 
        error: "Password must be at least 6 characters long" 
      });
    }

    console.log('Creating new user...');
    const user = new User({ name, email, phone, password });
    await user.save();
    console.log('User saved successfully');

    console.log('Generating auth token...');
    const token = await user.generateAuthToken();
    console.log('Token generated successfully');
    
    res.status(201).json({ 
      success: true, 
      user: { 
        id: user._id,
        name: user.name,
        email: user.email
      }, 
      token 
    });
  } catch (err) {
    console.error('Signup error details:', {
      message: err.message,
      code: err.code,
      stack: err.stack,
      name: err.name
    });
    
    if (err.code === 11000) {
      // Check which field caused the duplicate key error
      if (err.message.includes('email')) {
        return res.status(400).json({ 
          success: false, 
          error: "Email already exists" 
        });
      } else if (err.message.includes('phone')) {
        return res.status(400).json({ 
          success: false, 
          error: "Phone number already exists" 
        });
      }
    }
    res.status(400).json({ 
      success: false, 
      error: err.message || "An error occurred during signup" 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token as response
    res.json({ success: true, token });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

module.exports = router;