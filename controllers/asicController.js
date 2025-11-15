const asicService = require('../services/asicService');
const ApiError = require('../utils/ApiError');
const validateAndHandle = require('../utils/validateAndHandle');
const { StatusCodes } = require('http-status-codes');

const getAsics = validateAndHandle(
  async (req, res) => {
    const userId = req.auth.payload.sub;
    const { page = 1, limit = 10 } = req.query;
    const [asics, total] = await asicService.getUserAsics(userId, page, limit);

    res.json({
      asics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  },
  { runValidation: false }
);

const getAsicDetails = validateAndHandle(
  async (req, res) => {
    const userId = req.auth.payload.sub;
    const asic = await asicService.getAsicById(req.params.asicId, userId);

    if (!asic) {
      throw new ApiError('ASIC not found', StatusCodes.BAD_REQUEST);
    }

    res.json({ asic });
  },
  { runValidation: false }
);

const getAsicPerformance = validateAndHandle(
  async (req, res) => {
    const userId = req.auth.payload.sub;
    const { period = '7d' } = req.query;
    const now = new Date();

    let startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (period === '24h') {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    if (period === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const data = await asicService.getPerformanceData(req.params.asicId, userId, startDate);

    res.json({ data });
  },
  { runValidation: false }
);

const updateStatus = validateAndHandle(
  async (req, res) => {
    const userId = req.auth.payload.sub;
    const { status } = req.body;

    const updated = await asicService.updateAsicStatus(req.params.asicId, userId, status);

    if (!updated) {
      throw new ApiError('ASIC not found', StatusCodes.BAD_REQUEST);
    }

    res.json({ message: 'Status updated', asic: updated });
  },
  { runValidation: true }
);

module.exports = {
  getAsics,
  getAsicDetails,
  getAsicPerformance,
  updateStatus,
};

// //controllers/asicController.js
// const { validationResult } = require('express-validator');
// const asicService = require('../services/asicService');
// const sendError = require('../utils/sendError');

// const getAsics = async (req, res) => {
//   try {
//     const userId = req.auth.payload.sub; // string
//     const { page = 1, limit = 10 } = req.query;
//     const [asics, total] = await asicService.getUserAsics(userId, page, limit);

//     res.json({
//       asics,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error('Get ASICs error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getAsicDetails = async (req, res) => {
//   try {
//     const userId = req.auth.payload.sub; // string
//     const asic = await asicService.getAsicById(req.params.asicId, userId);
//     if (!asic) {
//       return sendError(res, 404, 'ASIC not found');
//     }
//     res.json({ asic });
//   } catch (error) {
//     console.error('Get ASIC error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getAsicPerformance = async (req, res) => {
//   try {
//     const userId = req.auth.payload.sub; // string
//     const { period = '7d' } = req.query;
//     const now = new Date();
//     let startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

//     if (period === '24h') {
//       startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
//     }
//     if (period === '30d') {
//       startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//     }

//     const data = await asicService.getPerformanceData(
//       req.params.asicId,
//       // req.user.userId,
//       userId,
//       startDate
//     );
//     res.json({ data });
//   } catch (error) {
//     console.error('Performance error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const updateStatus = async (req, res) => {
//   try {
//     const userId = req.auth.payload.sub; // string
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return sendError(res, 400, errors.array());
//     }

//     const { status } = req.body;
//     // const updated = await asicService.updateAsicStatus(req.params.asicId, req.user.userId, status);
//     const updated = await asicService.updateAsicStatus(req.params.asicId, userId, status);

//     if (!updated) {
//       return sendError(res, 404, 'ASIC not found');
//     }

//     res.json({ message: 'Status updated', asic: updated });
//   } catch (error) {
//     console.error('Update status error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   getAsics,
//   getAsicDetails,
//   getAsicPerformance,
//   updateStatus,
// };
