const express = require('express');
const router = express.Router();
const { 
  generateImage,
  editImage,
  getImageHistory,
  getImage,
  deleteImage,
  toggleFavorite
} = require('../controllers/imageController');
const { protect } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// Public routes
router.post('/generate', rateLimiter, generateImage);
router.post('/edit', rateLimiter, editImage);

// Protected routes
router.get('/history', protect, getImageHistory);
router.get('/:id', protect, getImage);
router.delete('/:id', protect, deleteImage);
router.put('/:id/favorite', protect, toggleFavorite);

module.exports = router;