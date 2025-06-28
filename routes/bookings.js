const express = require('express');
const { check, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Store = require('../models/Store');
const { auth, storeManagerAuth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', [
  auth,
  check('serviceId', 'Service ID is required').not().isEmpty(),
  check('date', 'Date is required').not().isEmpty(),
  check('time', 'Time is required').not().isEmpty(),
  check('numberOfPeople', 'Number of people must be at least 1').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { serviceId, date, time, numberOfPeople, specialRequests } = req.body;

  try {
    // Check if service exists and is active
    const service = await Service.findById(serviceId).populate('store');
    if (!service || !service.isActive) {
      return res.status(400).json({ message: 'Service not found or inactive' });
    }

    // Check if booking date is in the future
    const bookingDate = moment(date);
    if (bookingDate.isBefore(moment(), 'day')) {
      return res.status(400).json({ message: 'Cannot book for past dates' });
    }

    // Check if the service is available on the selected day
    const dayOfWeek = bookingDate.format('dddd').toLowerCase();
    const dayAvailability = service.availability[dayOfWeek];
    
    if (!dayAvailability.isOpen) {
      return res.status(400).json({ message: 'Service is not available on this day' });
    }

    // Check if time is within operating hours
    const bookingTime = moment(time, 'HH:mm');
    const openTime = moment(dayAvailability.open, 'HH:mm');
    const closeTime = moment(dayAvailability.close, 'HH:mm');
    
    if (bookingTime.isBefore(openTime) || bookingTime.isAfter(closeTime)) {
      return res.status(400).json({ message: 'Booking time is outside operating hours' });
    }

    // Check for conflicting bookings (simplified version)
    const endTime = bookingTime.clone().add(service.duration, 'minutes');
    const conflictingBooking = await Booking.findOne({
      service: serviceId,
      date: bookingDate.toDate(),
      status: { $in: ['pending', 'confirmed'] },
      time: { $lt: endTime.format('HH:mm') }
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    // Calculate total price
    const totalPrice = service.price * numberOfPeople;

    const booking = new Booking({
      user: req.user.id,
      service: serviceId,
      store: service.store._id,
      date: bookingDate.toDate(),
      time,
      duration: service.duration,
      numberOfPeople,
      totalPrice,
      specialRequests
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('store')
      .populate('user', 'name email phone');

    res.json(populatedBooking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('service')
      .populate('store')
      .sort({ date: -1, time: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('store')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin/store manager
    if (booking.user._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'store_manager') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin/store manager
    if (booking.user.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'store_manager') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    booking.cancelledBy = req.user.role === 'admin' ? 'admin' : 
                         req.user.role === 'store_manager' ? 'store' : 'customer';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('store')
      .populate('user', 'name email phone');

    res.json(populatedBooking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/bookings/store/:storeId
// @desc    Get bookings for a specific store (store managers and admins only)
// @access  Private
router.get('/store/:storeId', storeManagerAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ store: req.params.storeId })
      .populate('service')
      .populate('user', 'name email phone')
      .sort({ date: -1, time: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (store managers and admins only)
// @access  Private
router.put('/:id/status', storeManagerAuth, async (req, res) => {
  const { status, notes } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    if (notes) booking.notes = notes;

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('store')
      .populate('user', 'name email phone');

    res.json(populatedBooking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 