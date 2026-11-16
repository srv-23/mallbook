const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Store = require('../models/Store');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

const REVENUE_STATUSES = ['confirmed', 'completed'];

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const today = moment().startOf('day');
    const tomorrow = today.clone().add(1, 'day');
    const weekStart = moment().startOf('week');
    const nextWeek = weekStart.clone().add(1, 'week');
    const monthStart = moment().startOf('month');
    const nextMonth = monthStart.clone().add(1, 'month');

    const [
      totalUsers,
      totalStores,
      totalServices,
      totalBookings,
      todayBookings,
      weekBookings,
      monthBookings
    ] = await Promise.all([
      User.countDocuments(),
      Store.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ date: { $gte: today.toDate(), $lt: tomorrow.toDate() } }),
      Booking.countDocuments({ date: { $gte: weekStart.toDate(), $lt: nextWeek.toDate() } }),
      Booking.countDocuments({ date: { $gte: monthStart.toDate(), $lt: nextMonth.toDate() } })
    ]);

    const revenueFor = (from, to) =>
      Booking.aggregate([
        {
          $match: {
            date: { $gte: from.toDate(), $lt: to.toDate() },
            status: { $in: REVENUE_STATUSES }
          }
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]);

    const [todayRevenue, weekRevenue, monthRevenue] = await Promise.all([
      revenueFor(today, tomorrow),
      revenueFor(weekStart, nextWeek),
      revenueFor(monthStart, nextMonth)
    ]);

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('service', 'name')
      .populate('store', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const bookingStatuses = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Cancelled bookings must not inflate "top services" the way they are
    // excluded from the revenue cards.
    const topServices = await Booking.aggregate([
      { $match: { status: { $in: REVENUE_STATUSES } } },
      {
        $group: {
          _id: '$service',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 }
    ]);

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
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filters (admins only)
// @access  Private/Admin
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const { status, date, store, service } = req.query;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = moment(date).startOf('day');
      if (!startDate.isValid()) {
        return res.status(400).json({ success: false, message: 'Invalid date filter' });
      }
      query.date = { $gte: startDate.toDate(), $lt: startDate.clone().add(1, 'day').toDate() };
    }

    if (store) {
      query.store = store;
    }

    if (service) {
      query.service = service;
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('user', 'name email phone')
        .populate('service', 'name category')
        .populate('store', 'name category')
        .sort({ date: -1, time: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query)
    ]);

    res.json({
      bookings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/reports
// @desc    Get booking reports (admins only)
// @access  Private/Admin
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      const start = moment(startDate).startOf('day');
      const end = moment(endDate).endOf('day');

      if (!start.isValid() || !end.isValid()) {
        return res.status(400).json({ success: false, message: 'Invalid date range' });
      }

      dateFilter = { date: { $gte: start.toDate(), $lte: end.toDate() } };
    }

    const dailyBookings = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

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
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
