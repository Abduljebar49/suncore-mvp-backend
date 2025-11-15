const ASIC = require('../models/ASIC');

const getUserAsics = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [asics, total] = await Promise.all([
    ASIC.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ASIC.countDocuments({ userId }),
  ]);

  return {
    asics,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getUserAsicById = async (userId, asicId) => {
  return ASIC.findOne({ _id: asicId, userId });
};

const updateAsicStatus = async (userId, asicId, status) => {
  return ASIC.findOneAndUpdate(
    { _id: asicId, userId },
    { status, 'performance.lastSeen': new Date() },
    { new: true }
  );
};

module.exports = {
  getUserAsics,
  getUserAsicById,
  updateAsicStatus,
};
