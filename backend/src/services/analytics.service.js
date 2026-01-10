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
    { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
  ]);

  return {
    totalUsers,
    activeUsers: activeUsers.length,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
  };
};

// export const getSignupsOverTimeService = async (from, to) => {
//   return User.aggregate([
//     {
//       $match: {
//         signup_date: { $gte: new Date(from), $lte: new Date(to) }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: '%Y-%m-%d', date: '$signup_date' }
//         },
//         count: { $sum: 1 }
//       }
//     },
//     { $sort: { _id: 1 } }
//   ]);
// };

// export const getEventsOverTimeService = async (from, to) => {
//   return Event.aggregate([
//     {
//       $match: {
//         event_timestamp: { $gte: new Date(from), $lte: new Date(to) }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: '%Y-%m-%d', date: '$event_timestamp' }
//         },
//         count: { $sum: 1 }
//       }
//     },
//     { $sort: { _id: 1 } }
//   ]);
// };

// export const getPurchasesOverTimeService = async (from, to) => {
//   return Transaction.aggregate([
//     {
//       $match: {
//         payment_status: 'success',
//         transaction_date: { $gte: new Date(from), $lte: new Date(to) }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: '%Y-%m-%d', date: '$transaction_date' }
//         },
//         totalAmount: { $sum: '$amount' },
//         count: { $sum: 1 }
//       }
//     },
//     { $sort: { _id: 1 } }
//   ]);
// };

// export const getBreakdownService = async (field) => {
//   return User.aggregate([
//     {
//       $group: {
//         _id: `$${field}`,
//         count: { $sum: 1 }
//       }
//     },
//     { $sort: { count: -1 } }
//   ]);
// };

export const getAgeGroupBreakdownService = async () => {
  return User.aggregate([
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

const buildFilters = (query) => {
  const filters = {};

  if (query.from || query.to) {
    const dateFilter = {};
    if (query.from) dateFilter.$gte = new Date(query.from);
    if (query.to) dateFilter.$lte = new Date(query.to);
  }

  if (query.gender) filters.gender = query.gender;
  if (query.country) filters.country = query.country;
  if (query.device_type) filters.device_type = query.device_type;

  return filters;
};

export const getSignupsOverTimeService = async (query) => {
  const filters = buildFilters(query);
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
  const filters = {};
  if (query.from || query.to) {
    filters.event_timestamp = {};
    if (query.from) filters.event_timestamp.$gte = new Date(query.from);
    if (query.to) filters.event_timestamp.$lte = new Date(query.to);
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
  const filters = { payment_status: 'success' };
  if (query.from || query.to) {
    filters.transaction_date = {};
    if (query.from) filters.transaction_date.$gte = new Date(query.from);
    if (query.to) filters.transaction_date.$lte = new Date(query.to);
  }

  if (query.gender || query.country || query.device_type) {
    const matchUsers = await User.find({
      ...(query.gender && { gender: query.gender }),
      ...(query.country && { country: query.country }),
      ...(query.device_type && { device_type: query.device_type }),
    }).select('user_id');

    const userIds = matchUsers.map((u) => u.user_id);
    filters.user_id = { $in: userIds };
  }

  return Transaction.aggregate([
    { $match: filters },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$transaction_date' },
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getBreakdownService = async (field, query) => {
  const filters = buildFilters(query);

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
