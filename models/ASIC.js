const mongoose = require('mongoose');

const asicSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    asicId: {
      type: String,
      required: true,
      unique: true,
    },
    model: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    specifications: {
      hashrate: { type: Number, required: true }, // TH/s
      powerConsumption: { type: Number, required: true }, // Watts
      efficiency: { type: Number, required: true }, // J/TH
      algorithm: { type: String, default: 'SHA-256' },
    },
    status: {
      type: String,
      enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE', 'ERROR'],
      default: 'offline',
    },
    location: {
      facility: String,
      rack: String,
      position: String,
    },
    performance: {
      currentHashrate: { type: Number, default: 0 },
      temperature: { type: Number, default: 0 },
      fanSpeed: { type: Number, default: 0 },
      uptime: { type: Number, default: 0 }, // percentage
      lastSeen: { type: Date, default: Date.now },
    },
    earnings: {
      daily: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    purchaseInfo: {
      purchaseDate: Date,
      purchasePrice: Number,
      warrantyExpiry: Date,
    },
    maintenanceHistory: [
      {
        date: { type: Date, default: Date.now },
        type: { type: String, required: true },
        description: String,
        technician: String,
        cost: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
asicSchema.index({ userId: 1 });
asicSchema.index({ status: 1 });
asicSchema.index({ 'performance.lastSeen': 1 });

// Virtual for ROI calculation
asicSchema.virtual('roi').get(function () {
  if (!this.purchaseInfo.purchasePrice || this.purchaseInfo.purchasePrice === 0) {
    return 0;
  }
  return (this.earnings.total / this.purchaseInfo.purchasePrice) * 100;
});

module.exports = mongoose.model('ASIC', asicSchema);
