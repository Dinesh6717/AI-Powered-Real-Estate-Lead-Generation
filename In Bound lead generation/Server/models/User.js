const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
  },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  tokens: { type: [String], required: true, default: [] },
comments: [{
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
});

// Generate auth token
userSchema.methods.generateAuthToken = async function() {
  try {
    const token = jwt.sign(
      { _id: this._id, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    this.tokens.push(token);
    await this.save();
    return token;
  } catch (error) {
    throw new Error('Error generating authentication token');
  }
};

// Remove a token
userSchema.methods.removeToken = async function(token) {
  try {
    this.tokens = this.tokens.filter(t => t !== token);
    await this.save();
  } catch (err) {
    throw new Error('Error removing token');
  }
};

// Find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
