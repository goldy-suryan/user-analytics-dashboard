import User from '../models/user.model.js';
import Event from '../models/event.model.js';
import Transaction from '../models/transaction.model.js';

export const getKPIsService = async () => {
  const totalUsers = await User.countDocuments();

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const activeUsers = await Event.distinct('user_id', {
    event_timestamp: { $gte: last30Days },
  });

  const revenueResult = await Transaction.aggregate([
    { $match: { payment_status: 'success' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalPurchases: { $sum: 1 },
      },
    },
  ]);

  const totalPurchases = revenueResult[0]?.totalPurchases || 0;
  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  const conversionRate =
    totalUsers > 0
      ? Number(((totalPurchases / totalUsers) * 100).toFixed(2))
      : 0;

  return {
    totalUsers,
    activeUsers: activeUsers.length,
    totalPurchases,
    totalRevenue,
    conversionRate,
  };
};

const buildFilters = async (query, prop) => {
  const filters = {};

  if ((query.from || query.to) && prop) {
    filters[prop] = {};
    if (query.from) filters[prop].$gte = new Date(query.from);
    if (query.to) filters[prop].$lte = new Date(query.to);
  }

  if (query.gender || query.country || query.device_type) {
    // Join User collection for filters
    const matchUsers = await User.find({
      ...(query.gender && { gender: query.gender }),
      ...(query.country && { country: query.country }),
      ...(query.device_type && { device_type: query.device_type }),
    }).select('user_id');

    const userIds = matchUsers.map((u) => u.user_id);
    filters.user_id = { $in: userIds };
  }

  return filters;
};

export const getSignupsOverTimeService = async (query) => {
  const filters = await buildFilters(query, 'signup_date');

  return User.aggregate([
    { $match: filters },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$signup_date' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getEventsOverTimeService = async (query) => {
  const filters = await buildFilters(query, 'event_timestamp');

  return Event.aggregate([
    { $match: filters },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$event_timestamp' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getPurchasesOverTimeService = async (query) => {
  const filters = {
    ...(await buildFilters(query, 'transaction_date')),
    payment_status: 'success',
  };

  return Transaction.aggregate([
    { $match: filters },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$transaction_date' },
        },
        totalPurchases: { $sum: 1 },
        totalRevenue: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getBreakdownService = async (field, query) => {
  const filters = await buildFilters(query, 'signup_date');

  return User.aggregate([
    { $match: filters },
    {
      $group: {
        _id: `$${field}`,
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

export const getAgeGroupBreakdownService = async (query) => {
  const filters = await buildFilters(query);

  return User.aggregate([
    { $match: filters },
    {
      $bucket: {
        groupBy: '$age',
        boundaries: [18, 25, 35, 45, 60],
        default: '60+',
        output: {
          count: { $sum: 1 },
        },
      },
    },
  ]);
};
