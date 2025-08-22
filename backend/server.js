const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fileUpload = require('express-fileupload');
require('dotenv').config();

// Import configurations
const connectDB = require('./config/db');
const setupDBMonitoring = require('./utils/dbMonitor');
const logger = require('./utils/logger');
const { corsOptions } = require('./config/config');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const apiRoutes = require('./routes/api');

// Initialize express app
const app = express();

// Connect to Database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
  setupDBMonitoring(); // Set up MongoDB connection monitoring
}

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors(corsOptions));

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Add file upload middleware
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  abortOnLimit: true,
  createParentPath: true,
  useTempFiles: false, // Using memory to store files
  debug: process.env.NODE_ENV === 'development' // Enable debug mode in development
}));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Mount API routes
app.use('/api', apiRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Any routes not caught by API will be served the React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Set port
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = { app, server };