const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    required: [true, 'Please provide a prompt'],
    trim: true
  },
  model: {
    type: String,
    enum: ['img3', 'img4', 'qwen', 'uncen'],
    required: true
  },
  size: {
    type: String,
    enum: ['1024x1024', '1792x1024', '1024x1792'],
    default: '1024x1024'
  },
  urls: [{
    type: String,
    required: true
  }],
  seed: {
    type: Number
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Index for faster querying
ImageSchema.index({ user: 1, createdAt: -1 });
ImageSchema.index({ user: 1, isFavorite: 1 });

// Virtual for image count
ImageSchema.virtual('imageCount').get(function() {
  return this.urls.length;
});

// Method to add tag
ImageSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this;
};

// Method to remove tag
ImageSchema.methods.removeTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag);
  return this;
};

module.exports = mongoose.model('Image', ImageSchema);