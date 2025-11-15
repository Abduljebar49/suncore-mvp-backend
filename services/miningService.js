const MiningData = require('../models/MiningData');

const getAggregatedPerformanceData = async (userId, startDate) => {
  return MiningData.aggregate([
    {
      $match: {
        userId,
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        avgHashrate: { $avg: '$metrics.hashrate' },
        totalEarnings: { $sum: '$earnings.netEarnings' },
        avgEfficiency: { $avg: '$metrics.efficiency' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const getEarningsByPeriod = async (userId, groupBy, dateRange) => {
  return MiningData.aggregate([
    {
      $match: {
        userId,
        timestamp: { $gte: dateRange },
      },
    },
    {
      $group: {
        _id: groupBy,
        grossEarnings: { $sum: '$earnings.btcEarned' },
        usdValue: { $sum: '$earnings.usdValue' },
        poolFees: { $sum: '$earnings.poolFee' },
        managementFees: { $sum: '$earnings.managementFee' },
        netEarnings: { $sum: '$earnings.netEarnings' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

module.exports = {
  getAggregatedPerformanceData,
  getEarningsByPeriod,
};
