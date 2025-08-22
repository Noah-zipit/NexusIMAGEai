const winston = require('winston');
const path = require('path');
const config = require('../config/config');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define the console format
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Create logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'nexus-image-gen' },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: consoleFormat
    })
  ]
});

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  // Create logs directory if it doesn't exist
  const fs = require('fs');
  const dir = path.dirname(config.logging.file);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Add file transport
  logger.add(new winston.transports.File({
    filename: config.logging.file,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    tailable: true
  }));
  
  // Add error file transport
  logger.add(new winston.transports.File({
    filename: path.join(dir, 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    tailable: true
  }));
}

// Stream object for Morgan
logger.stream = {
  write: message => logger.info(message.trim())
};

module.exports = logger;