//services/paymentService.js
const Payment = require('../models/Payment');
const User = require('../models/User');
const { maybeActivateUser } = require('./userStatusService');

const create = (data) => new Payment(data).save();

const getHistory = async ({ userId, page, limit, type }) => {
  const query = { userId };
  if (type) {
    query.type = type;
  }

  const payments = await Payment.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Payment.countDocuments(query);

  return {
    payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const findPaymentByIntent = async (intentId) => {
  return await Payment.findOne({ stripePaymentIntentId: intentId });
};

const updatePaymentStatus = async (payment, status, failureReason = null) => {
  payment.status = status;
  payment.failureReason = failureReason;
  if (status === 'COMPLETED') {
    // if (status === 'COMPLETED' || status === 'FAILED') {
    payment.processedAt = new Date();
  }
  await payment.save();
};

// ✅ Updated: accepts only the `object` now
const handlePaymentIntentSucceeded = async (object) => {
  const intentId = object.id;
  let payment = await findPaymentByIntent(intentId);

  // Fallback: try metadata._id
  if (!payment && object.metadata?._id) {
    payment = await Payment.findById(object.metadata._id);
  }

  if (!payment) {
    throw new Error(`Payment not found for intent ${intentId}`);
  }
  await updatePaymentStatus(payment, 'COMPLETED');
  // Auto activate user if KYC is APPROVE and hasPaid is true (TBR)
  const user = await User.findById(payment.userId);
  user.hasPaid = true;
  user.plan = payment.metadata?.asicPurchase?.bundleType?.toUpperCase() || 'STANDARD';
  await user.save();
  await maybeActivateUser(user._id);
};

const handlePaymentIntentFailed = async (object) => {
  const intentId = object.id;
  let payment = await findPaymentByIntent(intentId);

  // Fallback: try metadata._id
  if (!payment && object.metadata?._id) {
    payment = await Payment.findById(object.metadata._id);
  }

  if (!payment) {
    throw new Error(`Payment not found for failed intent ${intentId}`);
  }
  await updatePaymentStatus(payment, 'FAILED', object.last_payment_error?.message);
};

const handleChargeSucceeded = async (object) => {
  const intentId = object.payment_intent;
  let payment = await findPaymentByIntent(intentId);

  if (!payment && object.metadata?._id) {
    payment = await Payment.findById(object.metadata._id);
  }

  if (payment && payment.status !== 'COMPLETED') {
    await updatePaymentStatus(payment, 'COMPLETED');
  }
};

const handleChargeFailed = async (object) => {
  const intentId = object.payment_intent;
  let payment = await findPaymentByIntent(intentId);

  if (!payment && object.metadata?._id) {
    payment = await Payment.findById(object.metadata._id);
  }

  if (payment) {
    await updatePaymentStatus(payment, 'FAILED', object.failure_message);
  }
};

const handleCheckoutSessionCompleted = async (sessionObject) => {
  const intentId = sessionObject.payment_intent;
  let payment = await findPaymentByIntent(intentId);

  if (!payment && sessionObject.metadata?._id) {
    payment = await Payment.findById(sessionObject.metadata._id);
  }

  if (payment) {
    await updatePaymentStatus(payment, 'COMPLETED');
  }
};

module.exports = {
  create,
  getHistory,
  handlePaymentIntentSucceeded,
  handlePaymentIntentFailed,
  handleChargeSucceeded,
  handleChargeFailed,
  handleCheckoutSessionCompleted,
};
