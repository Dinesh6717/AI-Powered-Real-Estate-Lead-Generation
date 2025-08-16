const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  area: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  images: [String], // If you want to store image paths
  // Add any additional fields you need
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
