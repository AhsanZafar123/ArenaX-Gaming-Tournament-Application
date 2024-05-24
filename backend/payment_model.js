const mongoose = require('mongoose');

// Define the payment schema
const paymentSchema = new mongoose.Schema({
  cardNum: {
    type: String,
    required: true
  },
  expiryMon: {
    type: Number,
    required: true
  },
  expiryYear: {
    type: Number,
    required: true
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentResponse: {
    type: Object,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);