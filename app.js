//app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Sentry = require('@sentry/node');
require('dotenv').config();
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');
const setupSwagger = require('./utils/swagger');

//for health cheeck
const mongoose = require('mongoose');
const packageJson = require('./package.json');
const stripe = require('stripe')(
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_SECRET_KEY_LIVE
    : process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY
);

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const asicRoutes = require('./routes/asics');
const miningRoutes = require('./routes/mining');
const paymentRoutes = require('./routes/payments');
const kycRoutes = require('./routes/kyc');
const marketRoutes = require('./routes/market');
const adminRoutes = require('./routes/admin');
const webhookRoute = require('./routes/webhook');
const freshRoute = require('./routes/freshdesk');

const app = express();
app.set('trust proxy', 1); // instead of `true`
setupSwagger(app); // enable swagger at /api-docs
// if (process.env.ENABLE_SWAGGER === 'true') {
//   setupSwagger(app);
// }

// if (process.env.NODE_ENV !== 'production') {
//   setupSwagger(app);
// }

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

// Stripe webhook needs raw body parsing — must be mounted before express.json()
app.use('/api/v1/payments/webhook', webhookRoute);
app.use('/api/v1/verify/webhooks', webhookRoute);

const allowedOrigin =
  process.env.NODE_ENV === 'development' ? process.env.FRONTEND_URL : 'http://localhost:3000';
// 'http://localhost:3000';

// Middleware
app.use(helmet({ crossOriginEmbedderPolicy: false })); //prevents blocking file upload
app.use(limiter);
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

//Sentry init
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0, // For performance tracing (optional)
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
});

// Capture request context before all routes
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/asics', asicRoutes);
app.use('/api/v1/mining', miningRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/kyc', kycRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/freshdesk', freshRoute);

app.get('/api/v1/health', async (req, res) => {
  let stripeAvailable = false;
  let stripeApiVersion = null;
  let mongoVersion = null;

  try {
    const balance = await stripe.balance.retrieve();
    stripeAvailable = !!balance;

    // Get Stripe API version (if configured)
    stripeApiVersion = stripe.getApiField('version');
  } catch (err) {
    console.error('Stripe health check failed:', err.message);
  }

  try {
    const admin = new mongoose.mongo.Admin(mongoose.connection.db);
    const info = await admin.buildInfo();
    mongoVersion = info.version;
  } catch (err) {
    console.error('MongoDB version check failed:', err.message);
  }

  res.status(200).json({
    status: 'OK',
    version: packageJson.version,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    db: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      version: mongoVersion,
    },
    stripe: {
      available: stripeAvailable,
      apiVersion: stripeApiVersion,
    },
  });
});

app.get('/', (req, res) => {
  res.send(
    'Welcome to SunCore Crypto API. Visit /api/v1/health to check status (temp dev on RND).'
  );
});

// //visit to test sentry error
app.get('/api/v1/test-error', (_req, _res) => {
  throw new Error('AWESOME Test Sentry crash ==== COMBINED');
});

// Global error handler
// After all routes
app.use(Sentry.Handlers.errorHandler());

// Winston logger
// app.use((err, req, res, next) => {
//   logger.error('Unhandled error', { message: err.message, stack: err.stack }); // Sentry will now catch this via Winston
//   res.status(500).json({
//     message: 'Internal server error',
//     ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
//   });
// });

// 404 fallback
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Handle any errors that Sentry didn't catch
app.use(errorHandler);

module.exports = app;
