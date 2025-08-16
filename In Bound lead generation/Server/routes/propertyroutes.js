const express = require('express');
const Property = require('../models/Property');
const Favorite = require('../models/Favorite');
const authenticateUser = require('../middleware/authenticateUser');

const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching properties' });
  }
});

// Get a single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching property' });
  }
});

// PATCH favorite/unfavorite a property
router.patch('/:id/favorite', authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id
    console.log('req.user:', req.user); // Log user
    const propertyId = req.params.id;
    console.log('propertyId:', propertyId); // Log propertyId

    // Step 1: Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Step 2: Find or create Favorite record
    let favorite = await Favorite.findOne({  user: userId });
    if (!favorite) {
      favorite = new Favorite({ user: userId, properties: [] });
    }

    // Step 3: Toggle favorite
    const isFavorited = favorite.properties.includes(propertyId);
    if (isFavorited) {
      favorite.properties = favorite.properties.filter(id => id.toString() !== propertyId);
    } else {
      favorite.properties.push(propertyId);
    }

    // Step 4: Save
    await favorite.save();
    console.log('✅ Favorite toggled');
    res.json({ success: true, isFavorited: !isFavorited });

  } catch (err) {
    console.error('Error toggling favorite:', err);
    console.error(err);
    res.status(500).json({ error: 'Error toggling favorite', details: err.message });
  }
});

module.exports = router;
