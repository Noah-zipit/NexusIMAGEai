const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB Atlas cluster
 */
const connectDB = async () => {
  try {
    // MongoDB connection URI from environment variables
    const connectionURI = process.env.MONGODB_URI;
    
    if (!connectionURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(connectionURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // These options help with connection stability to Atlas
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // Optional settings for MongoDB Atlas connection
      retryWrites: true,
      w: 'majority'
    });

    logger.info(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB Disconnected');
  } catch (error) {
    logger.error(`Error disconnecting from MongoDB: ${error.message}`);
  }
};

module.exports = connectDB;
module.exports.disconnect = disconnectDB;