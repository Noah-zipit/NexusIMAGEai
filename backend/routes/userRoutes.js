const express = require('express');
const router = express.Router();
const { 
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// Public routes
router.post('/register', rateLimiter, registerUser);
router.post('/login', rateLimiter, loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUser);

module.exports = router;