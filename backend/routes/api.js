const express = require('express');
const router = express.Router();

// Import route modules
const imageRoutes = require('./imageRoutes');
const userRoutes = require('./userRoutes');

// Mount route modules
router.use('/images', imageRoutes);
router.use('/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;