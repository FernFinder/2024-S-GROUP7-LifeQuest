const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /users/me - retrieve logged in user
router.get('/me', async (req, res, next) => {
  try {
    // access user from request which has been
    // attached by the userVerification middleware
    const user = req.user;
    // if no user found, send back 404
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // send back the user
    res.status(200).json(user);
  } catch (error) {
    // send back 500 and error message
    res.status(500).json({ message: error.message });
  }
});

// GET /users/:email - retrieve a user by email
router.get('/:email', async (req, res, next) => {
  try {
    // find user in database by email
    const user = await User.findOne({ email: req.params.email });
    // if no user found, send back 404
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // send back the user
    res.json(user);
  } catch (error) {
    // send back 500 and error message
    res.status(500).json({ message: error.message });
  }
});


// DELETE /users/:email - delete user by id
router.delete('/:email', async (req, res, next) => {
  try {
    // find user by email and delete
    const user = await User.findOne({ email: req.params.email });
    // if no user found, send back 404
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // delete user
    const deletedUser = await User.findByIdAndDelete(user._id);
    // respond with success message and deleted user
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    // send back 500 and error message
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
