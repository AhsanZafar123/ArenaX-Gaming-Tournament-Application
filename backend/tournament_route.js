const express = require('express');
const router = express.Router();
const Tournament = require('./tournament_model');

// Route to create a new tournament
router.post('/create', async (req, res) => {
  try {
    // Check if the request body contains an array of matches
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: "Invalid request body. Expected an array." });
    }

    // Create an array to hold the new tournaments
    const newTournaments = [];

    // Iterate through each match in the request body and create a new tournament for each
    for (const match of req.body) {
      const { tournamentName, date, code, payment, imageURL } = match;

      // Create a new tournament object
      const newTournament = new Tournament({
        tournamentName,
        date,
        code,
        payment,
        imageURL, // Include imageURL field
      });

      // Save the new tournament to the database
      await newTournament.save();

      // Add the new tournament to the array
      newTournaments.push(newTournament);
    }

    // Respond with the array of new tournaments
    res.status(201).json(newTournaments);
  } catch (err) {
    console.error("Error creating new tournament:", err); 
    res.status(400).json({ message: err.message });
  }
});

// Route to get all tournaments with code, imageURL, and unique id
router.get('/getTournamentsWithCodeAndImage', async (req, res) => {
  try {
    console.log("Fetching all tournaments with code, image, and id");
    // Find all tournaments with the code, imageURL, and id fields included
    const tournaments = await Tournament.find({}, '_id tournamentName date code payment imageURL');
    res.status(200).json(tournaments);
  } catch (err) {
    console.error("Error fetching tournaments with code, image, and id:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;