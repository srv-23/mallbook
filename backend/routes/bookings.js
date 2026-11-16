const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { auth, storeManagerAuth } = require('../middleware/auth');
const { canManageStore, forbidden } = require('../utils/storeAccess');
const moment = require('moment');

const router = express.Router();

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const ACTIVE_STATUSES = ['pending', 'confirmed'];
const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const toTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const overlaps = (startA, endA, startB, endB) => startA < endB && startB < endA;

const canManageBooking = async (user, booking) => {
  if (user.role === 'admin') return true;
  if (user.role !== 'store_manager') return false;

  // booking.store may be a raw ObjectId or a populated store document.
  const storeId = booking.store && booking.store._id ? booking.store._id : booking.store;
  return canManageStore(user, storeId);
};

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', [
  auth,
  check('serviceId', 'Service ID is required').not().isEmpty(),
  check('serviceId', 'Service ID must be valid').isMongoId(),
  check('date', 'Date is required').not().isEmpty(),
  check('date', 'Date must be a valid date').isISO8601(),
  check('time', 'Time is required').matches(TIME_PATTERN).withMessage('Time must use HH:mm format'),
  check('numberOfPeople', 'Number of people must be at least 1').isInt({ min: 1 }),
  check('specialRequests').optional().isLength({ max: 500 }).withMessage('Special requests are too long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { serviceId, date, time, numberOfPeople, specialRequests } = req.body;

  try {
    const service = await Service.findById(serviceId).populate('store');
    if (!service || !service.isActive) {
      return res.status(400).json({ success: false, message: 'Service not found or inactive' });
    }

    if (!service.store) {
      return res.status(400).json({ success: false, message: 'Service is not attached to a store' });
    }

    const bookingDate = moment(date);
    if (!bookingDate.isValid()) {
      return res.status(400).json({ success: false, message: 'Invalid booking date' });
    }

    bookingDate.startOf('day');

    if (bookingDate.isBefore(moment().startOf('day'))) {
      return res.status(400).json({ success: false, message: 'Cannot book for past dates' });
    }

    const dayOfWeek = bookingDate.format('dddd').toLowerCase();
    const dayAvailability = service.availability && service.availability[dayOfWeek];

    if (!dayAvailability || !dayAvailability.isOpen) {
      return res.status(400).json({ success: false, message: 'Service is not available on this day' });
    }

    if (!dayAvailability.open || !dayAvailability.close) {
      return res.status(400).json({ success: false, message: 'Service operating hours are not configured' });
    }

    const startMinutes = toMinutes(time);
    const endMinutes = startMinutes + Number(service.duration);
    const openMinutes = toMinutes(dayAvailability.open);
    const closeMinutes = toMinutes(dayAvailability.close);

    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      return res.status(400).json({
        success: false,
        message: 'Booking time is outside operating hours'
      });
    }

    // Only compare against bookings on the same calendar day. Comparing the exact
    // Date value breaks as soon as a client sends a timestamp instead of a date.
    const sameDayBookings = await Booking.find({
      service: serviceId,
      date: { $gte: bookingDate.toDate(), $lte: bookingDate.clone().endOf('day').toDate() },
      status: { $in: ACTIVE_STATUSES }
    }).select('time duration numberOfPeople');

    const capacity = service.capacity || 1;
    let reservedPeople = 0;
    let hasConflict = false;

    for (const existing of sameDayBookings) {
      const existingStart = toMinutes(existing.time);
      const existingEnd = existingStart + Number(existing.duration);

      if (overlaps(startMinutes, endMinutes, existingStart, existingEnd)) {
        hasConflict = true;
        reservedPeople += existing.numberOfPeople || 1;
      }
    }

    if (hasConflict && capacity === 1) {
      return res.status(400).json({ success: false, message: 'Time slot is already booked' });
    }

    if (hasConflict && reservedPeople + numberOfPeople > capacity) {
      return res.status(400).json({
        success: false,
        message: `Only ${Math.max(capacity - reservedPeople, 0)} place(s) left for this time slot`
      });
    }

    const totalPrice = service.price * numberOfPeople;

    const booking = new Booking({
      user: req.user.id,
      service: serviceId,
      store: service.store._id,
      date: bookingDate.toDate(),
      time,
      endTime: toTime(endMinutes),
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

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/bookings
// @desc    Get the caller's bookings
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
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/bookings/store/:storeId
// @desc    Get bookings for a store the caller manages
// @access  Private/Store manager or admin
router.get('/store/:storeId', storeManagerAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.storeId)) {
      return res.status(400).json({ success: false, message: 'Invalid store ID' });
    }

    if (!(await canManageStore(req.user, req.params.storeId))) {
      return forbidden(res);
    }

    const bookings = await Booking.find({ store: req.params.storeId })
      .populate('service')
      .populate('user', 'name email phone')
      .sort({ date: -1, time: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID (owner, the store's manager, or an admin)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('store')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isOwner = booking.user && String(booking.user._id) === String(req.user.id);
    if (!isOwner && !(await canManageBooking(req.user, booking))) {
      return forbidden(res, 'Not authorized to view this booking');
    }

    res.json(booking);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', [
  auth,
  check('reason').optional().isLength({ max: 500 }).withMessage('Reason is too long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isOwner = String(booking.user) === String(req.user.id);
    if (!isOwner && !(await canManageBooking(req.user, booking))) {
      return forbidden(res, 'Not authorized to cancel this booking');
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    booking.cancelledBy = req.user.role === 'admin'
      ? 'admin'
      : req.user.role === 'store_manager'
        ? 'store'
        : 'customer';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('store')
      .populate('user', 'name email phone');

    res.json(populatedBooking);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (the store's manager or an admin)
// @access  Private/Store manager or admin
router.put('/:id/status', [
  storeManagerAuth,
  check('status', 'A valid status is required').isIn(BOOKING_STATUSES),
  check('notes').optional().isLength({ max: 500 }).withMessage('Notes are too long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { status, notes } = req.body;

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (!(await canManageBooking(req.user, booking))) {
      return forbidden(res);
    }

    booking.status = status;
    if (notes) booking.notes = notes;

    if (status === 'cancelled') {
      booking.cancelledBy = req.user.role === 'admin' ? 'admin' : 'store';
      booking.cancellationReason = req.body.reason || 'Cancelled by store';
    }

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('store')
      .populate('user', 'name email phone');

    res.json(populatedBooking);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
