// //controllers/marketController.js
const marketService = require('../services/marketService');
const validateAndHandle = require('../utils/validateAndHandle');

const getBtcPrice = validateAndHandle(
  async (req, res) => {
    const price = await marketService.getBtcPrice();
    res.json(price);
  },
  { runValidation: false }
);

const getBtcHistory = validateAndHandle(
  async (req, res) => {
    const { period = '1y' } = req.query;
    const mapping = {
      '1d': [24, 'hour'],
      '1w': [7, 'day'],
      '1m': [30, 'day'],
      '3m': [90, 'day'],
      '1y': [365, 'day'],
      '5y': [5, 'year'],
    };

    const [points, interval] = mapping[period] || [365, 'day'];
    const data = marketService.generateMockData(points, interval);
    res.json({ period, data });
  },
  { runValidation: false }
);

const getNetworkStats = validateAndHandle(
  async (req, res) => {
    const stats = marketService.getMockNetworkStats();
    res.json(stats);
  },
  { runValidation: false }
);

const getAsicProfitability = validateAndHandle(
  async (req, res) => {
    const { model } = req.query;
    const data = marketService.getMockAsicProfitability(model);
    res.json(data);
  },
  { runValidation: false }
);

module.exports = {
  getBtcPrice,
  getBtcHistory,
  getNetworkStats,
  getAsicProfitability,
};

// const marketService = require('../services/marketService');

// const getBtcPrice = async (req, res) => {
//   try {
//     const price = await marketService.getBtcPrice();
//     res.json(price);
//   } catch (error) {
//     console.error('Error fetching BTC price:', error);
//     res.status(500).json({ message: 'Error fetching BTC price' });
//   }
// };

// const getBtcHistory = async (req, res) => {
//   try {
//     const { period = '1y' } = req.query;
//     const mapping = {
//       '1d': [24, 'hour'],
//       '1w': [7, 'day'],
//       '1m': [30, 'day'],
//       '3m': [90, 'day'],
//       '1y': [365, 'day'],
//       '5y': [5, 'year']
//     };

//     const [points, interval] = mapping[period] || [365, 'day'];
//     const data = marketService.generateMockData(points, interval);
//     res.json({ period, data });
//   } catch (error) {
//     console.error('Error fetching BTC history:', error);
//     res.status(500).json({ message: 'Error fetching BTC history' });
//   }
// };

// const getNetworkStats = (req, res) => {
//   try {
//     const stats = marketService.getMockNetworkStats();
//     res.json(stats);
//   } catch (error) {
//     console.error('Error fetching network stats:', error);
//     res.status(500).json({ message: 'Error fetching network statistics' });
//   }
// };

// const getAsicProfitability = (req, res) => {
//   try {
//     const { model } = req.query;
//     const data = marketService.getMockAsicProfitability(model);
//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching ASIC profitability:', error);
//     res.status(500).json({ message: 'Error fetching ASIC profitability data' });
//   }
// };

// module.exports = {
//   getBtcPrice,
//   getBtcHistory,
//   getNetworkStats,
//   getAsicProfitability
// };
