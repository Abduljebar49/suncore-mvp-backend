//services/adminService.js
const User = require('../models/User');
const ASIC = require('../models/ASIC');
const Payment = require('../models/Payment');

exports.getDashboardData = async () => {
  const [totalUsers, activeUsers, pendingKYC, totalASICs, onlineASICs, revenueAgg] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'ACTIVE' }),
      User.countDocuments({ kycStatus: 'SUBMITTED' }),
      ASIC.countDocuments(),
      ASIC.countDocuments({ status: 'ONLINE' }),
      Payment.aggregate([
        { $match: { status: 'COMPLETED', type: 'PURCHASE' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      pendingKYC,
    },
    asics: {
      total: totalASICs,
      online: onlineASICs,
      offline: totalASICs - onlineASICs,
    },
    revenue: {
      total: revenueAgg[0]?.total || 0,
    },
  };
};

exports.getPaginatedUsers = async ({ page = 1, limit = 20, status, kycStatus }) => {
  const query = {};
  if (status) {
    query.status = status;
  }
  if (kycStatus) {
    query.kycStatus = kycStatus;
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit * 1);

  const total = await User.countDocuments(query);

  return {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

exports.updateUserStatus = async (userId, status) => {
  if (!['PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED'].includes(status)) {
    throw new Error('Invalid status');
  }

  const user = await User.findByIdAndUpdate(userId, { status }, { new: true }).select('-password');
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

exports.updateKycStatus = async (userId, status, notes) => {
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new Error('Invalid KYC status');
  }

  const update = {
    kycStatus: status,
    ...(status === 'APPROVED' && { 'kycData.approvedAt': new Date() }),
    'kycData.notes': notes,
  };

  const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

exports.promoteUserToAdmin = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'ADMIN') {
    // We throw a custom error we can catch in controller
    const error = new Error('User is already an admin');
    error.statusCode = 200;
    throw error;
  }

  user.role = 'ADMIN';
  await user.save();

  return user;
};
