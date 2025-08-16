// models/Favorite.js
const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the user model
    required: true
  },
  properties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property', // Referencing the property model
      required: true
    }
  ]
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);
module.exports = Favorite;
