// controllers/stripeEventController.js
const stripeEventService = require('../services/stripeEventService');
const validateAndHandle = require('../utils/validateAndHandle');
const { StatusCodes } = require('http-status-codes');

const getStripeEvents = validateAndHandle(
  async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const result = await stripeEventService.getAllStripeEvents({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.status(StatusCodes.OK).json(result);
  },
  { runValidation: false }
);

module.exports = getStripeEvents;

// //controllers/stripeEventController.js
// const stripeEventService = require('../services/stripeEventService');

// const getStripeEvents = async (req, res, next) => {
//   try {
//     const { page, limit } = req.query;
//     const result = await stripeEventService.getAllStripeEvents({
//       page: parseInt(page) || 1,
//       limit: parseInt(limit) || 20,
//     });
//     res.status(200).json(result);
//   } catch (error) {
//     console.error('Error fetching Stripe events:', error);
//     res.status(500).json({ message: 'Error fetching Stripe events' });
//   }
// };
// module.exports = getStripeEvents;
