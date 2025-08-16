// routes/commentRoutes.js
const express = require('express');
const User = require('../models/User');
const authenticateUser = require('../middleware/authenticateUser');
const { detectBuyingIntent } = require('../utils/leadDetection');
const { sendIntentEmail } = require('../utils/email');

const router = express.Router();

// POST /api/comments
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { propertyId, comment } = req.body;
    const userId = req.user._id; // From authenticateUser middleware

    // Validation
    if (!comment?.trim()) {
      return res.status(400).json({ 
        success: false,
        message: "Comment cannot be empty" 
      });
    }

    if (!propertyId) {
      return res.status(400).json({ 
        success: false,
        message: "Property ID is required" 
      });
    }

    // Save comment to user's profile
    await User.updateOne(
      { _id: userId },
      { $push: { 
        comments: { 
          propertyId, 
          text: comment.trim(), 
          timestamp: new Date() 
        } 
      } }
    );
const cleanedComment = comment.trim();
const intentDetected = await detectBuyingIntent(comment);
if (intentDetected) {
      const user = await User.findById(userId);
      if (user?.email) {
        sendIntentEmail(user.email, cleanedComment);
      }
    }
    res.json({ 
      success: true,
      message: "Comment saved successfully",
      comment: {
        propertyId,
        text: cleanedComment,
        timestamp: new Date()
      }
    });

  } catch (err) {
    console.error('Comment save error:', err);
    res.status(500).json({ 
      success: false,
      message: "Error saving comment" 
    });
  }
});

module.exports = router;