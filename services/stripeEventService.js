const StripeEventLog = require('../models/StripeEventLog');

exports.getAllStripeEvents = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    StripeEventLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    StripeEventLog.countDocuments()
  ]);

  return {
    events,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};