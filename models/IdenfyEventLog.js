const mongoose = require('mongoose');

const IdenfyEventLogSchema = new mongoose.Schema(
  {
    scanRef: { type: String, required: true },
    status: { type: String, required: true },
    info: { type: mongoose.Schema.Types.Mixed },
    rawBody: { type: mongoose.Schema.Types.Mixed },
    processed: { type: Boolean, default: false },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('IdenfyEventLog', IdenfyEventLogSchema);
