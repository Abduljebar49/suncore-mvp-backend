const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    auth0Id: {
      // new field for Auth0 integration
      type: String,
      unique: true,
      sparse: true,
    },
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      trim: true,
      default: '', // or make it optional
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '', // or remove required
    },
    role: {
      type: String,
      enum: ['CLIENT', 'ADMIN', 'SUPPORT'],
      default: 'CLIENT',
    },
    plan: {
      type: String,
      enum: ['BASIC', 'STANDARD', 'PREMIUM'], // <-- TBR
      default: 'BASIC',
    },
    hasPaid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED'],
      default: 'PENDING',
    },
    kycStatus: {
      type: String,
      enum: ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    kycData: {
      documentType: String,
      documentNumber: String,
      verificationId: String,
      submittedAt: Date,
      approvedAt: Date,
      documentImageUrl: String, // link to uploaded ID image (e.g., S3, Cloudinary)
      selfieImageUrl: String, // link to uploaded face capture
      metadata: mongoose.Schema.Types.Mixed, // optional for provider response
    },
    walletAddress: {
      type: String,
      trim: true,
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
      },
      payoutFrequency: {
        type: String,
        enum: ['WEEKLY', 'BIWEEKLY', 'MONTHLY'],
        default: 'MONTHLY',
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ status: 1 });
userSchema.index({ kycStatus: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
