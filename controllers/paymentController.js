// controllers/paymentController.js
const stripeService = require('../services/stripeService');
const paymentService = require('../services/paymentService');
const validateAndHandle = require('../utils/validateAndHandle');
// const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const createPaymentIntent = validateAndHandle(
  async (req, res) => {
    const { amount, currency, asicModel, quantity, unitPrice } = req.body;

    const auth0Id = req.auth.payload.sub;
    const userId = req.user._id;

    const paymentIntent = await stripeService.createIntent({
      amount,
      currency,
      userId: auth0Id,
      metadata: {
        asicModel,
        quantity,
        unitPrice,
        // bundleType, // <- future addition
        // planLevel   // <- future addition
      },
    });

    const payment = await paymentService.create({
      userId,
      type: 'PURCHASE',
      amount,
      currency,
      paymentMethod: 'STRIPE',
      stripePaymentIntentId: paymentIntent.id,
      description: `Purchase of ${quantity}x ${asicModel}`,
      metadata: {
        asicPurchase: {
          asicModel,
          quantity,
          unitPrice,
        },
      },
    });

    return res.status(StatusCodes.OK).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  },
  { runValidation: true }
);

const getPaymentHistory = validateAndHandle(
  async (req, res) => {
    const { page = 1, limit = 10, type } = req.query;
    const auth0Id = req.auth.payload.sub;

    const result = await paymentService.getHistory({
      userId: auth0Id,
      page,
      limit,
      type,
    });

    return res.status(StatusCodes.OK).json(result);
  },
  { runValidation: false }
);

module.exports = {
  createPaymentIntent,
  getPaymentHistory,
};

// //controllers/paymentController.js
// const { validationResult } = require('express-validator');
// const sendError = require('../utils/sendError');
// const stripeService = require('../services/stripeService');
// const paymentService = require('../services/paymentService');

// const createPaymentIntent = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return sendError(res, 400, errors.array());
//   }

//   const { amount, currency, asicModel, quantity, unitPrice } = req.body;
//   const auth0Id = req.auth.payload.sub;
//   const userId = req.user._id; // ✅ Mongo ObjectId from ensureUserExists

//   try {
//     const paymentIntent = await stripeService.createIntent({
//       amount,
//       currency,
//       userId: auth0Id,
//       metadata: {
//         asicModel,
//         quantity,
//         unitPrice,
//         //       bundleType,   // <- collect from req.body (TBR)
//         // planLevel     // <- optional (TBR)
//       },
//     });

//     const payment = await paymentService.create({
//       userId,
//       type: 'PURCHASE',
//       amount,
//       currency,
//       paymentMethod: 'STRIPE',
//       stripePaymentIntentId: paymentIntent.id,
//       description: `Purchase of ${quantity}x ${asicModel}`,
//       metadata: {
//         asicPurchase: {
//           asicModel,
//           quantity,
//           unitPrice,
//           //          bundleType,   // <- collect from req.body (TBR)
//           // planLevel
//         },
//       },
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//       paymentId: payment._id,
//     });
//   } catch (err) {
//     console.error('Create payment intent error:', err);
//     sendError(res, 500, 'Server error during payment intent creation');
//   }
// };

// const getPaymentHistory = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, type } = req.query;
//     const auth0Id = req.auth.payload.sub;

//     const result = await paymentService.getHistory({
//       userId: auth0Id,
//       page,
//       limit,
//       type,
//     });
//     res.json(result);
//   } catch (err) {
//     console.error('Payment history fetch error:', err);
//     sendError(res, 500, 'Server error while fetching payments');
//   }
// };

// module.exports = { createPaymentIntent, getPaymentHistory };
