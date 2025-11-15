// models/KycLog.js
const mongoose = require('mongoose');

const KycLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scanRef: { type: String, required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KycLog', KycLogSchema);
