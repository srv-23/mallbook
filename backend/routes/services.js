const express = require('express');
const { check, validationResult } = require('express-validator');
const Service = require('../models/Service');
const Store = require('../models/Store');
const Booking = require('../models/Booking');
const { storeManagerAuth } = require('../middleware/auth');
const { canManageStore, forbidden } = require('../utils/storeAccess');
const { escapeRegex } = require('../utils/regex');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all active services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, store, search } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (store) {
      query.store = store;
    }

    if (search) {
      const term = escapeRegex(search.trim());
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } }
      ];
    }

    const services = await Service.find(query)
      .populate('store', 'name location category')
      .sort({ rating: -1, name: 1 });

    res.json(services);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/services/categories
// @desc    Get all service categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/services/:id
// @desc    Get service by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('store', 'name location category contact operatingHours');

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/services
// @desc    Create a new service for a store the caller manages
// @access  Private/Store manager or admin
router.post('/', [
  storeManagerAuth,
  check('name', 'Service name is required').trim().not().isEmpty(),
  check('description', 'Description is required').trim().not().isEmpty(),
  check('category', 'Category is required').isIn(['restaurant', 'entertainment', 'beauty', 'fitness', 'shopping', 'services', 'facilities']),
  check('store', 'Store ID is required').not().isEmpty(),
  check('price', 'Price must be a positive number').isFloat({ min: 0 }),
  check('duration', 'Duration must be at least 15 minutes').isInt({ min: 15 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {
    name,
    description,
    category,
    store,
    price,
    duration,
    capacity,
    images,
    availability,
    features
  } = req.body;

  try {
    const storeExists = await Store.findById(store);
    if (!storeExists) {
      return res.status(400).json({ success: false, message: 'Store not found' });
    }

    if (!(await canManageStore(req.user, store))) {
      return forbidden(res);
    }

    const service = new Service({
      name,
      description,
      category,
      store,
      price,
      duration,
      capacity: capacity || 1,
      images: images || [],
      availability: availability || {
        monday: { open: '09:00', close: '18:00', isOpen: true },
        tuesday: { open: '09:00', close: '18:00', isOpen: true },
        wednesday: { open: '09:00', close: '18:00', isOpen: true },
        thursday: { open: '09:00', close: '18:00', isOpen: true },
        friday: { open: '09:00', close: '18:00', isOpen: true },
        saturday: { open: '09:00', close: '18:00', isOpen: true },
        sunday: { open: '10:00', close: '16:00', isOpen: true }
      },
      features: features || []
    });

    await service.save();

    const populatedService = await Service.findById(service._id)
      .populate('store', 'name location category');

    res.status(201).json(populatedService);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update a service (its store's manager or an admin)
// @access  Private/Store manager or admin
router.put('/:id', storeManagerAuth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (!(await canManageStore(req.user, service.store))) {
      return forbidden(res);
    }

    const {
      name,
      description,
      category,
      price,
      duration,
      capacity,
      images,
      availability,
      features,
      isActive
    } = req.body;

    if (name) service.name = name;
    if (description) service.description = description;
    if (category) service.category = category;
    if (price !== undefined) service.price = price;
    if (duration) service.duration = duration;
    if (capacity) service.capacity = capacity;
    if (images) service.images = images;
    if (availability) service.availability = availability;
    if (features) service.features = features;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    const populatedService = await Service.findById(service._id)
      .populate('store', 'name location category');

    res.json(populatedService);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service that has never been booked
// @access  Private/Store manager or admin
router.delete('/:id', storeManagerAuth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (!(await canManageStore(req.user, service.store))) {
      return forbidden(res);
    }

    // Deleting a booked service would leave dangling references on existing
    // bookings, so booked services must be deactivated instead.
    const bookingCount = await Booking.countDocuments({ service: req.params.id });
    if (bookingCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'This service has bookings. Deactivate it instead of deleting.'
      });
    }

    await service.deleteOne();
    res.json({ success: true, message: 'Service removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
