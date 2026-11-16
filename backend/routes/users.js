const express = require('express');
const User = require('../models/User');
const Store = require('../models/Store');
const { adminAuth } = require('../middleware/auth');
const { escapeRegex } = require('../utils/regex');

const router = express.Router();

const ROLES = ['customer', 'admin', 'store_manager'];

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt
});

// @route   GET /api/users
// @desc    List users, optionally filtered by role or name/email search
// @access  Private/Admin
router.get('/', adminAuth, async (req, res) => {
  const { role, search } = req.query;

  const query = {};

  if (role) {
    if (!ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role filter' });
    }
    query.role = role;
  }

  if (search) {
    const term = escapeRegex(search.trim());
    query.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } }
    ];
  }

  try {
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get a single user
// @access  Private/Admin
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update a user, including their role
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  const { name, email, phone, role, isVerified } = req.body;

  if (role && !ROLES.includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isSelf = String(user._id) === String(req.user.id);

    // An admin editing their own role can lock everyone out by demoting the
    // last admin, so self-changes are refused rather than merely discouraged.
    if (isSelf && role && role !== user.role) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    // Belt and braces: even for another user, never remove the final admin.
    if (user.role === 'admin' && role && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot demote the only remaining admin'
        });
      }
    }

    if (email && email.toLowerCase() !== user.email) {
      const existing = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();

    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (String(user._id) === String(req.user.id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only remaining admin'
        });
      }
    }

    // Deleting a manager would otherwise leave stores pointing at a user that
    // no longer exists, so those stores are unassigned first.
    await Store.updateMany({ manager: user._id }, { $unset: { manager: 1 } });

    await user.deleteOne();
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
