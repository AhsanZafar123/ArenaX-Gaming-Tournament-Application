const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./users'); // Import user routes
const tournamentRoutes = require('./tournament_route');
const paymentRoutes = require('./payment');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://10.120.171.102:3000',
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/mydatabase';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Routes
app.use('/api', userRoutes);
app.use('/api', tournamentRoutes);
app.use('/api', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});