const mongoose = require('mongoose');

const miningDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  asicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ASIC',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  metrics: {
    hashrate: { type: Number, required: true }, // TH/s
    temperature: { type: Number, required: true }, // Celsius
    powerConsumption: { type: Number, required: true }, // Watts
    fanSpeed: { type: Number, required: true }, // RPM
    efficiency: { type: Number, required: true }, // J/TH
    uptime: { type: Number, required: true }, // seconds
    shares: {
      accepted: { type: Number, default: 0 },
      rejected: { type: Number, default: 0 },
      stale: { type: Number, default: 0 }
    }
  },
  earnings: {
    btcEarned: { type: Number, default: 0 },
    usdValue: { type: Number, default: 0 },
    poolFee: { type: Number, default: 0 },
    managementFee: { type: Number, default: 0 },
    netEarnings: { type: Number, default: 0 }
  },
  networkData: {
    difficulty: Number,
    blockHeight: Number,
    btcPrice: Number
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
miningDataSchema.index({ userId: 1, timestamp: -1 });
miningDataSchema.index({ asicId: 1, timestamp: -1 });
miningDataSchema.index({ timestamp: -1 });

// TTL index to automatically delete old data after 2 years
miningDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 });

module.exports = mongoose.model('MiningData', miningDataSchema);