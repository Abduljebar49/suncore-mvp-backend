//services/userService.js
const User = require('../models/User');

const findByEmail = (email) => User.findOne({ email });

// const serializeUser = (user) => ({
//   id: user._id,
//   firstName: user.firstName,
//   lastName: user.lastName,
//   email: user.email,
//   role: user.role,
//   status: user.status,
//   kycStatus: user.kycStatus,
// });

const serializeUser = (user) => ({
  // id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  kycStatus: user.kycStatus,
  role: user.role,
}); //Purpose: for client view

const serializeUserForAdmin = (user) => ({
  id: user._id,
  email: user.email,
  kycStatus: user.kycStatus,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  loginHistory: user.loginHistory,
}); //Purpose: for Admin view

const serializeUserMinimal = (user) => ({
  id: user._id,
  email: user.email,
}); //Purpose: for public view

const getUserByAuth0Id = async (auth0Id) => {
  return await User.findOne({ auth0Id }).select('-password');
};

const getUserByAuth0IAndSerialize = async (auth0Id) => {
  const user = await User.findOne({ auth0Id }).select('-password');
  return user ? serializeUser(user) : null;
};

const updateKYC = async (auth0Id, kycData) => {
  return await User.findOneAndUpdate(
    { auth0Id },
    { kycStatus: 'SUBMITTED', kycData },
    { new: true }
  ).select('-password');
};

const updateKYCByScanRef = async (scanRef, updateData) => {
  return await User.findOneAndUpdate(
    { 'kycData.verificationId': scanRef },
    { $set: updateData },
    { new: true }
  );
};

const getKYCStatus = async (auth0Id) => {
  const user = await User.findOne({ auth0Id }).select('kycStatus email');
  console.log(user, 'user ===');
  return {
    status: user?.kycStatus || 'unknown',
    email: user?.email || null,
  };
};

module.exports = {
  getUserByAuth0Id,
  getUserByAuth0IAndSerialize,
  findByEmail,
  serializeUser,
  serializeUserForAdmin,
  serializeUserMinimal,
  updateKYC,
  getKYCStatus,
  updateKYCByScanRef,
};
