const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Puzzle', 'Indie']
  },
  images: [{
    type: String
  }],
  downloadUrl: {
    type: String,
    required: true
  },
  systemRequirements: {
    minimum: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String
    },
    recommended: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String
    }
  },
  tags: [String],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);