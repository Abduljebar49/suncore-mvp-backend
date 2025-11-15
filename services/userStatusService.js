// // services/userStatusService.js
const User = require('../models/User');

const maybeActivateUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const kycApproved = user.kycStatus === 'APPROVED';
  const paymentDone = user.hasPaid === true;

  const alreadyActive = user.status === 'ACTIVE';

  if (kycApproved && paymentDone && !alreadyActive) {
    user.status = 'ACTIVE';
    user.activatedAt = new Date();
    await user.save();
    // Optionally: log activation, emit event, send email, etc.
  }
};

module.exports = { maybeActivateUser };
