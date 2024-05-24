const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  tournamentName: {
    type: String
  },
  date: {
    type: Date
  },
  code: {
    type: Number
  },
  payment: {
    type: Number
  },
  imageURL: {
    type: String // Store the URL of the image
  }
});

// Create a Mongoose model from the schema and export it
module.exports = mongoose.model('Tournament', tournamentSchema);
