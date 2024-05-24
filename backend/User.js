const mongoose = require('mongoose');

// Define the schema for user data
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roleId: {
    type: Number,
    required: true,
    default: 2 // Default role ID for admin
  },
});

// Create a Mongoose model from the schema and export it
module.exports = mongoose.model('User', userSchema);
