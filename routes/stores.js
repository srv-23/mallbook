const express = require('express');
const { check, validationResult } = require('express-validator');
const Store = require('../models/Store');
const Service = require('../models/Service');
const { auth, storeManagerAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/stores
// @desc    Get all active stores
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, floor, search } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (floor) {
      query['location.floor'] = parseInt(floor);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const stores = await Store.find(query)
      .populate('manager', 'name email')
      .sort({ rating: -1, name: 1 });

    res.json(stores);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/stores/categories
// @desc    Get all store categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Store.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/stores/floors
// @desc    Get all floors
// @access  Public
router.get('/floors', async (req, res) => {
  try {
    const floors = await Store.distinct('location.floor');
    res.json(floors.sort((a, b) => a - b));
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/stores/:id
// @desc    Get store by ID with services
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate('manager', 'name email phone');

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Get active services for this store
    const services = await Service.find({ 
      store: req.params.id, 
      isActive: true 
    }).sort({ name: 1 });

    res.json({
      store,
      services
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/stores
// @desc    Create a new store (admins only)
// @access  Private
router.post('/', [
  auth,
  check('name', 'Store name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('category', 'Category is required').isIn(['fashion', 'electronics', 'food', 'beauty', 'entertainment', 'services', 'other']),
  check('location.floor', 'Floor number is required').isInt({ min: 1 }),
  check('location.unit', 'Unit number is required').not().isEmpty(),
  check('contact.phone', 'Phone number is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    description,
    category,
    location,
    contact,
    manager,
    logo,
    images,
    operatingHours,
    features
  } = req.body;

  try {
    const store = new Store({
      name,
      description,
      category,
      location,
      contact,
      manager,
      logo: logo || '',
      images: images || [],
      operatingHours: operatingHours || {
        monday: { open: '09:00', close: '21:00', isOpen: true },
        tuesday: { open: '09:00', close: '21:00', isOpen: true },
        wednesday: { open: '09:00', close: '21:00', isOpen: true },
        thursday: { open: '09:00', close: '21:00', isOpen: true },
        friday: { open: '09:00', close: '22:00', isOpen: true },
        saturday: { open: '09:00', close: '22:00', isOpen: true },
        sunday: { open: '10:00', close: '20:00', isOpen: true }
      },
      features: features || []
    });

    await store.save();

    const populatedStore = await Store.findById(store._id)
      .populate('manager', 'name email');

    res.json(populatedStore);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/stores/:id
// @desc    Update a store (store managers and admins only)
// @access  Private
router.put('/:id', storeManagerAuth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const {
      name,
      description,
      category,
      location,
      contact,
      manager,
      logo,
      images,
      operatingHours,
      features,
      isActive
    } = req.body;

    if (name) store.name = name;
    if (description) store.description = description;
    if (category) store.category = category;
    if (location) store.location = location;
    if (contact) store.contact = contact;
    if (manager) store.manager = manager;
    if (logo !== undefined) store.logo = logo;
    if (images) store.images = images;
    if (operatingHours) store.operatingHours = operatingHours;
    if (features) store.features = features;
    if (isActive !== undefined) store.isActive = isActive;

    await store.save();

    const populatedStore = await Store.findById(store._id)
      .populate('manager', 'name email');

    res.json(populatedStore);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/stores/:id
// @desc    Delete a store (admins only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if store has active services
    const activeServices = await Service.find({ store: req.params.id, isActive: true });
    if (activeServices.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete store with active services. Please deactivate services first.' 
      });
    }

    await store.remove();
    res.json({ message: 'Store removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 