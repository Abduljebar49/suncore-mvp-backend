// //controllers/adminContoller.js
const adminService = require('../services/adminService');
const validateAndHandle = require('../utils/validateAndHandle');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const getDashboard = validateAndHandle(
  async (req, res) => {
    const data = await adminService.getDashboardData();
    res.json(data);
  },
  { runValidation: false }
);

const getUsers = validateAndHandle(async (req, res) => {
  const { page, limit, status, kycStatus } = req.query;
  const data = await adminService.getPaginatedUsers({ page, limit, status, kycStatus });
  res.json(data);
});

const updateUserStatus = validateAndHandle(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  const user = await adminService.updateUserStatus(userId, status);
  if (!user) {
    throw new ApiError('User not found', StatusCodes.NOT_FOUND);
  }

  res.json({ message: 'User status updated', user });
});

const updateKycStatus = validateAndHandle(async (req, res) => {
  const { userId } = req.params;
  const { status, notes } = req.body;

  const user = await adminService.updateKycStatus(userId, status, notes);
  if (!user) {
    throw new ApiError('User not found', StatusCodes.NOT_FOUND);
  }

  res.json({ message: `KYC ${status}`, user });
});

const promoteUser = validateAndHandle(async (req, res) => {
  const email = req.params.email || req.query.email;
  if (!email) {
    throw new ApiError('Email is required', StatusCodes.BAD_REQUEST);
  }

  const user = await adminService.promoteUserToAdmin(email);

  if (!user) {
    throw new ApiError('User not found', StatusCodes.NOT_FOUND);
  }

  if (user.alreadyAdmin) {
    return res.status(StatusCodes.OK).json({ message: 'User is already an admin' });
  }

  res.status(StatusCodes.OK).json({ message: `Promoted ${email} to admin.`, user });
});

module.exports = {
  getDashboard,
  getUsers,
  updateUserStatus,
  updateKycStatus,
  promoteUser,
};

// const adminService = require('../services/adminService');

// const getDashboard = async (req, res) => {
//   try {
//     const data = await adminService.getDashboardData();
//     res.json(data);
//   } catch (error) {
//     console.error('Admin dashboard error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getUsers = async (req, res) => {
//   try {
//     const { page, limit, status, kycStatus } = req.query;
//     const data = await adminService.getPaginatedUsers({ page, limit, status, kycStatus });
//     res.json(data);
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const updateUserStatus = async (req, res) => {
//   try {
//     const data = await adminService.updateUserStatus(req.params.userId, req.body.status);
//     res.json({ message: 'User status updated', user: data });
//   } catch (error) {
//     console.error('Update user status error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const updateKycStatus = async (req, res) => {
//   try {
//     const { status, notes } = req.body;
//     const data = await adminService.updateKycStatus(req.params.userId, status, notes);
//     res.json({ message: `KYC ${status}`, user: data });
//   } catch (error) {
//     console.error('Update KYC status error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const promoteUser = async (req, res) => {
//   try {
//     const email = req.params.email || req.query.email;

//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }

//     const user = await adminService.promoteUserToAdmin(email);
//     res.status(200).json({ message: `Promoted ${email} to admin.`, user });
//   } catch (error) {
//     console.error('Promote user error:', error);

//     // If it's the custom "already an admin" error
//     if (error.message === 'User is already an admin') {
//       return res.status(200).json({ message: error.message });
//     }

//     res.status(error.message === 'User not found' ? 404 : 500).json({
//       message: error.message || 'Server error',
//     });
//   }
// };

// module.exports = {
//   getDashboard,
//   getUsers,
//   updateUserStatus,
//   updateKycStatus,
//   promoteUser,
// };
