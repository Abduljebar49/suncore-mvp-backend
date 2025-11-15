const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['PURCHASE', 'PAYOUT', 'FEE', 'REFUND'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSED', 'COMPLETED', 'FAILED', 'CANCELED'],
      default: 'PENDING',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    paymentMethod: {
      type: String,
      enum: ['STRIPE', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY', 'BITCOIN', 'BANK_TRANSFER'],
      required: true,
    },
    stripePaymentIntentId: String,
    paypalOrderId: String,
    bitcoinAddress: String,
    bitcoinTxId: String,
    description: String,
    metadata: {
      asicPurchase: {
        asicModel: String,
        quantity: Number,
        unitPrice: Number,
      },
      payout: {
        walletAddress: String,
        btcAmount: Number,
        exchangeRate: Number,
        bundleType: String, // <-- TBR
        planLevel: String, // <-- TBR
      },
    },
    fees: {
      processingFee: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      networkFee: { type: Number, default: 0 },
    },
    processedAt: Date,
    failureReason: String,
  },
  {
    timestamps: true,
  }
);
-(
  // Indexes
  paymentSchema.index({ userId: 1, createdAt: -1 })
);
paymentSchema.index({ status: 1 });
paymentSchema.index({ type: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
