const mongoose = require('mongoose');
const fs = require('fs');
const Property = require('./models/Property');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Function to clean and convert data
const cleanPropertyData = (property) => {
  // Clean price and area fields
  const price = parseFloat(property.price.replace(/[^0-9.-]+/g, "")); // Remove any non-numeric characters
  const area = parseInt(property.area.replace(/[^0-9.-]+/g, "")); // Remove any non-numeric characters

  return {
    ...property,
    price,
    area
  };
};

// Import properties from JSON
const importProperties = () => {
  // Read the properties.json file
  fs.readFile('./properties/properties.json', 'utf8', async (err, data) => {
    if (err) {
      console.error('❌ Error reading properties.json:', err);
      return;
    }

    const properties = JSON.parse(data).properties;

    // Iterate over each property and save to the database
    for (const property of properties) {
      try {
        // Clean and format property data
        const cleanData = cleanPropertyData(property);

        // Create a new Property document
        const newProperty = new Property(cleanData);

        // Save to MongoDB
        await newProperty.save();
        console.log(`✅ Property "${property.title}" added successfully.`);
      } catch (error) {
        console.error(`❌ Error importing property "${property.title}":`, error);
      }
    }
  });
};

// Start importing properties
importProperties();
