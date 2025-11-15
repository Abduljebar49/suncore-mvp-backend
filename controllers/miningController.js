// controllers/miningController.js
const ASIC = require('../models/ASIC');
const miningService = require('../services/miningService');
const { StatusCodes } = require('http-status-codes');
const validateAndHandle = require('../utils/validateAndHandle');

const getDashboardHandler = async (req, res) => {
  const userId = req.auth.payload.sub;
  const asics = await ASIC.find({ userId });

  const totalHashrate = asics.reduce((sum, a) => sum + a.performance.currentHashrate, 0);
  const activeAsics = asics.filter((a) => a.status === 'online').length;
  const totalEarnings = asics.reduce((sum, a) => sum + a.earnings.total, 0);
  const avgUptime =
    asics.length > 0 ? asics.reduce((sum, a) => sum + a.performance.uptime, 0) / asics.length : 0;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const performanceData = await miningService.getAggregatedPerformanceData(userId, sevenDaysAgo);

  res.status(StatusCodes.OK).json({
    summary: {
      totalHashrate,
      activeAsics,
      totalAsics: asics.length,
      totalEarnings,
      avgUptime,
    },
    asics,
    performanceData,
  });
};

const getEarningsHandler = async (req, res) => {
  const userId = req.auth.payload.sub;
  const { period = 'monthly' } = req.query;

  let groupBy, dateRange;

  switch (period) {
    case 'daily':
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } };
      dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'weekly':
      groupBy = { $dateToString: { format: '%Y-W%U', date: '$timestamp' } };
      dateRange = new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
    default:
      groupBy = { $dateToString: { format: '%Y-%m', date: '$timestamp' } };
      dateRange = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000);
  }

  const earningsData = await miningService.getEarningsByPeriod(userId, groupBy, dateRange);
  res.status(StatusCodes.OK).json({ period, data: earningsData });
};

module.exports = {
  getDashboard: validateAndHandle(getDashboardHandler, { runValidation: false }),
  getEarnings: validateAndHandle(getEarningsHandler, { runValidation: false }),
};

// //controllers/miningController.js
// const ASIC = require('../models/ASIC');
// const miningService = require('../services/miningService');
// const { StatusCodes } = require('http-status-codes');

// const getDashboard = async (req, res) => {
//   try {
//     const userId = req.auth.payload.sub; // string
//     const asics = await ASIC.find({ userId });

//     const totalHashrate = asics.reduce((sum, a) => sum + a.performance.currentHashrate, 0);
//     const activeAsics = asics.filter((a) => a.status === 'online').length;
//     const totalEarnings = asics.reduce((sum, a) => sum + a.earnings.total, 0);
//     const avgUptime =
//       asics.length > 0 ? asics.reduce((sum, a) => sum + a.performance.uptime, 0) / asics.length : 0;

//     const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
//     const performanceData = await miningService.getAggregatedPerformanceData(userId, sevenDaysAgo);

//     res.status(StatusCodes.OK).json({
//       summary: {
//         totalHashrate,
//         activeAsics,
//         totalAsics: asics.length,
//         totalEarnings,
//         avgUptime,
//       },
//       asics,
//       performanceData,
//     });
//   } catch (err) {
//     console.error('Get mining dashboard error:', err);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
//   }
// };

// const getEarnings = async (req, res) => {
//   try {
//     const userId = req.auth.payload.sub; // string
//     const { period = 'monthly' } = req.query;

//     let groupBy, dateRange;

//     switch (period) {
//       case 'daily':
//         groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } };
//         dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//         break;
//       case 'weekly':
//         groupBy = { $dateToString: { format: '%Y-W%U', date: '$timestamp' } };
//         dateRange = new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000);
//         break;
//       case 'monthly':
//       default:
//         groupBy = { $dateToString: { format: '%Y-%m', date: '$timestamp' } };
//         dateRange = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000);
//     }

//     const earningsData = await miningService.getEarningsByPeriod(userId, groupBy, dateRange);
//     res.status(StatusCodes.OK).json({ period, data: earningsData });
//   } catch (err) {
//     console.error('Get earnings error:', err);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   getDashboard,
//   getEarnings,
// };
