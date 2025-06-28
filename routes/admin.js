const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Store = require('../models/Store');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const today = moment().startOf('day');
    const thisWeek = moment().startOf('week');
    const thisMonth = moment().startOf('month');

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Today's statistics
    const todayBookings = await Booking.countDocuments({
      date: { $gte: today.toDate() }
    });

    const todayRevenue = await Booking.aggregate([
      {
        $match: {
          date: { $gte: today.toDate() },
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // This week's statistics
    const weekBookings = await Booking.countDocuments({
      date: { $gte: thisWeek.toDate() }
    });

    const weekRevenue = await Booking.aggregate([
      {
        $match: {
          date: { $gte: thisWeek.toDate() },
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // This month's statistics
    const monthBookings = await Booking.countDocuments({
      date: { $gte: thisMonth.toDate() }
    });

    const monthRevenue = await Booking.aggregate([
      {
        $match: {
          date: { $gte: thisMonth.toDate() },
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('service', 'name')
      .populate('store', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Booking status distribution
    const bookingStatuses = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top services
    const topServices = await Booking.aggregate([
      {
        $group: {
          _id: '$service',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { bookings: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Populate service names
    const topServicesWithNames = await Service.populate(topServices, {
      path: '_id',
      select: 'name category'
    });

    res.json({
      totals: {
        users: totalUsers,
        stores: totalStores,
        services: totalServices,
        bookings: totalBookings
      },
      today: {
        bookings: todayBookings,
        revenue: todayRevenue[0]?.total || 0
      },
      week: {
        bookings: weekBookings,
        revenue: weekRevenue[0]?.total || 0
      },
      month: {
        bookings: monthBookings,
        revenue: monthRevenue[0]?.total || 0
      },
      recentBookings,
      bookingStatuses,
      topServices: topServicesWithNames
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filters (admins only)
// @access  Private
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const { status, date, store, service, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = moment(date).startOf('day');
      const endDate = moment(date).endOf('day');
      query.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
    }

    if (store) {
      query.store = store;
    }

    if (service) {
      query.service = service;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'name category')
      .populate('store', 'name category')
      .sort({ date: -1, time: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/reports
// @desc    Get booking reports (admins only)
// @access  Private
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: moment(startDate).startOf('day').toDate(),
          $lte: moment(endDate).endOf('day').toDate()
        }
      };
    }

    // Daily booking trends
    const dailyBookings = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Service category breakdown
    const serviceBreakdown = await Booking.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceData'
        }
      },
      { $unwind: '$serviceData' },
      {
        $group: {
          _id: '$serviceData.category',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { bookings: -1 } }
    ]);

    // Store performance
    const storePerformance = await Booking.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'stores',
          localField: 'store',
          foreignField: '_id',
          as: 'storeData'
        }
      },
      { $unwind: '$storeData' },
      {
        $group: {
          _id: '$storeData.name',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      dailyBookings,
      serviceBreakdown,
      storePerformance
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 