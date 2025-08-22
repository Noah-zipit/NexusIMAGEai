const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    unique: true,
    trim: true,
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferredModel: {
    type: String,
    enum: ['img3', 'img4', 'qwen', 'uncen'],
    default: 'img4'
  },
  preferredSize: {
    type: String,
    enum: ['1024x1024', '1792x1024', '1024x1792'],
    default: '1024x1024'
  },
  generateCount: {
    type: Number,
    default: 0
  },
  lastGeneratedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with stored hash
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to increment generation count
UserSchema.methods.incrementGenerateCount = async function() {
  this.generateCount += 1;
  this.lastGeneratedAt = Date.now();
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);