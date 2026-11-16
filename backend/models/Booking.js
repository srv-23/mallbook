const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  // Derived from time + duration on creation. Kept for reporting and future
  // overlap queries; the booking route still recomputes it from duration so
  // records created before this field existed stay checkable.
  endTime: {
    type: String
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  numberOfPeople: {
    type: Number,
    default: 1,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'online'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledBy: {
    type: String,
    enum: ['customer', 'store', 'admin']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes follow the query shapes used by the API:
// - slot conflict lookup and store dashboards filter by service/store + day
// - the customer booking list filters by user and sorts by date
bookingSchema.index({ service: 1, date: 1, status: 1 });
bookingSchema.index({ store: 1, date: -1 });
bookingSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Booking', bookingSchema); 