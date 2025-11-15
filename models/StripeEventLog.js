const mongoose = require('mongoose');

const stripeEventLogSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  status: { type: String, default: 'received' }, // or 'processed', 'error', etc.
  data: { type: Object, required: true },
  receivedAt: { type: Date, default: Date.now },
  error: { type: String } // if any
});

module.exports = mongoose.model('StripeEventLog', stripeEventLogSchema);