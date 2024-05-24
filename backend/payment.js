const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Payment = require('./payment_model');

// Function to validate and convert string to ObjectId
const toObjectId = (id) => {
  try {
    return mongoose.Types.ObjectId(id);
  } catch (error) {
    return id;
  }
};

router.post('/payment', async (req, res) => {
  try {
    const { cardNum, expiryMon, expiryYear, tournamentId, userId } = req.body;

    // Validate tournamentId and userId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(tournamentId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid tournamentId or userId');
    }

    // Construct the request data for payment processing
    const requestData = {
      source: {
        type: 'card',
        number: cardNum,
        expiry_month: expiryMon,
        expiry_year: expiryYear
      },
      amount: 10000, // Amount in your currency, e.g., 100 PKR
      currency: 'PKR',
      reference: 'ORD-175-759', // Replace with your order reference
      processing_channel_id: 'pc_3nuabekyrhcuvfl6dktwzpfrki' // Your processing channel ID
    };

    // Make a request to your payment gateway API
    const response = await axios.post('https://api.sandbox.checkout.com/payments/', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_sbox_zqwc76q3rjkvywhdxpsgdjyxgez' // Replace with your actual API key
      }
    });

    // Save payment data to the database
    const paymentData = {
      cardNum,
      expiryMon,
      expiryYear,
      tournamentId: toObjectId(tournamentId),
      userId: toObjectId(userId),
      paymentResponse: response.data // Save the entire response for logging or further processing
    };

    const payment = new Payment(paymentData);
    await payment.save();

    // Respond with success message
    res.status(201).json({ success: true, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: 'An error occurred while processing the payment' });
  }
});

module.exports = router;