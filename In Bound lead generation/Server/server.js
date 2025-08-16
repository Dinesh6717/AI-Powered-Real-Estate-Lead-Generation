const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Import routes and middleware
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/propertyRoutes');
const commentRoutes = require('./routes/commentRoutes');
const auth = require('./middleware/auth');


// Import models
const User = require('./models/User');
const Favorite = require('./models/Favorite');
const favoriteRoutes = require('./routes/favoriteRoutes');
const Property = require('./models/Property');

const app = express();

// Check critical env variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('❌ Missing critical environment variables. Check .env file.');
  console.error('Required variables: MONGO_URI, JWT_SECRET');
  process.exit(1);
}

// Debug logging for environment variables
console.log('🔑 Environment variables loaded:');
console.log('- MONGO_URI:', process.env.MONGO_URI ? '✅ Present' : '❌ Missing');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Present' : '❌ Missing');
console.log('- PORT:', process.env.PORT || 5000);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/favorites', favoriteRoutes);


// Debug logging for requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes registered at /api/auth');
app.use('/api/properties', propertyRoutes);
console.log('✅ Property routes registered at /properties');
app.use('/api/comments', commentRoutes);
console.log('✅ comment routes registered at /properties');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Serve static property images
app.use('/images', express.static(path.join(__dirname, 'images')));
console.log('Serving images from:', path.join(__dirname, 'images'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});


// Get single property from static properties.json
app.get('/api/properties', async (req, res) => {
  try {
    const propertiesPath = path.join(__dirname, 'properties', 'properties.json');
    const propertiesData = fs.readFileSync(propertiesPath, 'utf8');
    const properties = JSON.parse(propertiesData).properties;

    res.json(properties);
  } catch (err) {
    console.error('Error loading properties:', err);
    res.status(500).json({ error: 'Error loading properties' });
  }
});


// Handle favorites with email notification
app.post('/api/favorites', auth, async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user; // Comes from auth middleware

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Save favorite to MongoDB
    const favorite = new Favorite({
      user: userId,
      property: propertyId
    });
    await favorite.save();
}
catch (err) {
    console.error('Error processing favorite:', err);
    res.status(500).json({ error: 'Error processing favorite' });
  }
});

// Serve all static properties
app.get('/api/properties/static', (req, res) => {
  const propertiesPath = path.join(__dirname, 'properties', 'properties.json');
  fs.readFile(propertiesPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading properties.json:', err);
      return res.status(500).json({ error: 'Error loading properties' });
    }
    res.json(JSON.parse(data));
  });
});
// POST /api/comments
app.post('/api/comments', auth, async (req, res) => {
  const { propertyId, comment } = req.body;
  const userId = req.user.id;

  if (!comment || !propertyId) {
    return res.status(400).json({ success: false, message: "Missing comment or property ID" });
  }

  // Optional: Run NLP lead detection here

  
  await User.updateOne(
    { _id: userId },
    { $push: { comments: { propertyId, text: comment, timestamp: new Date() } } }
  );

  res.json({ success: true, message: "Comment saved" });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
