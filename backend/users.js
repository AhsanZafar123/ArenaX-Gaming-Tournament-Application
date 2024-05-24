const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./User');

// Route to create a new user
router.post('/register', async (req, res) => {
  try {
    const { name, username, password, roleId } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      roleId,
    });

    // Save the new user to the database
    await newUser.save();

    // Return a success message
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating new user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to authenticate a user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Return the user's ID upon successful authentication
    res.status(200).json({ userId: user._id });
  } catch (err) {
    console.error("Error authenticating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get all users with their _id
router.get('/getUsersWithId', async (req, res) => {
  try {
    // Find all users with their _id included
    const users = await User.find({}, '_id name username roleId');
    res.status(200).json({ success: true, users }); // Updated response structure
  } catch (err) {
    console.error("Error fetching users with _id:", err);
    res.status(500).json({ success: false, error: "Internal server error" }); // Updated response structure
  }
});
module.exports = router;