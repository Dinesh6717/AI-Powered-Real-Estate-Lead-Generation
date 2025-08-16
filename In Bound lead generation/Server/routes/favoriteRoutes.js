// routes/favoriteRoutes.js
const express = require('express');
const Favorite = require('../models/Favorite');
const Property = require('../models/Property');
const User = require('../models/User');
const authenticateUser = require('../middleware/authenticateUser');
const { sendFavoriteEmail } = require('../utils/email');


const router = express.Router();

// Endpoint to get user favorites
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userFavorites = await Favorite.findOne({ user: req.user._id })
      .populate('properties', 'title location price area images');
    
    if (!userFavorites) {
      return res.status(200).json({ properties: [] });
    }
    
    res.json({ 
      success: true,
      properties: userFavorites.properties 
    });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching favorites' 
    });
  }
});

// Endpoint to add or remove a favorite
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { propertyId } = req.body;

    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    let userFavorites = await Favorite.findOne({ user: req.user._id });
    let isFavorited;
const user = await User.findById(req.user._id);

    if (!userFavorites) {
      // Create new favorites document if none exists
      userFavorites = new Favorite({
        user: req.user._id,
        properties: [propertyId]
      });
      isFavorited = true;
console.log('Attempting to send email to:', user.email);
    } else {
      // Check if property is already favorited
      const propertyIndex = userFavorites.properties.findIndex(
        id => id.toString() === propertyId
      );
      
      isFavorited = propertyIndex === -1;
      
      if (isFavorited) {
        userFavorites.properties.push(propertyId);
       const user = await User.findById(req.user._id);
       if (user?.email) {
          sendFavoriteEmail(user.email, property.title);
       }
      } else {
        userFavorites.properties.splice(propertyIndex, 1);
      }
    }

    await userFavorites.save();
    
    res.json({ 
      success: true,
      isFavorited,
      properties: userFavorites.properties 
    });
  } catch (err) {
    console.error('Error processing favorite:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error processing favorite' 
    });
  }
});

module.exports = router;