const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['fashion', 'electronics', 'food', 'beauty', 'entertainment', 'services', 'other']
  },
  location: {
    floor: { type: Number, required: true },
    unit: { type: String, required: true },
    coordinates: {
      x: { type: Number },
      y: { type: Number }
    }
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String },
    website: { type: String }
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  logo: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    sunday: { open: String, close: String, isOpen: { type: Boolean, default: true } }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  features: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Store', storeSchema); 