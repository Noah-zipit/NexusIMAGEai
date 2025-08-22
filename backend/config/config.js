/**
 * Application configuration
 */
const config = {
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // Server
  port: process.env.PORT || 5000,
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'nexus_default_secret_key',
    expiresIn: process.env.JWT_EXPIRE || '7d'
  },
  
  // API Keys
  apiKeys: {
    infip: process.env.INFIP_API_KEY
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
  },
  
  // CORS options
  corsOptions: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  },
  
  // Image Generation
  imageGeneration: {
    baseUrl: 'https://api.infip.pro',
    defaultModel: 'img4',
    defaultSize: '1024x1024',
    supportedModels: ['img3', 'img4', 'qwen', 'uncen'],
    supportedSizes: ['1024x1024', '1792x1024', '1024x1792']
  }
};

module.exports = config;