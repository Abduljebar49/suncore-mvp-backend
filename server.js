// // //server.js
/* eslint-disable no-process-exit */
/**
 * server.js
 *
 * We intentionally allow `process.exit()` here to handle critical failures
 * like database connection errors or invalid configurations during startup.
 * This is the only file where exiting the Node process is appropriate.
 */

const http = require('http');
const app = require('./app');
const connectDB = require('./db/db');
const mongoose = require('mongoose');

const stripe = require('stripe')(
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_SECRET_KEY_LIVE
    : process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY
);

const PORT = process.env.PORT || 8000;
let server;

(async () => {
  try {
    await connectDB();

    server = http.createServer(app);

    server.listen(PORT, '0.0.0.0', async () => {
      console.log(`✅ SunCore API running on port ${PORT}`);
      console.log('🌐 ENV:', process.env.NODE_ENV);
      console.log('🛢️  DB:', mongoose.connection.host, '/', mongoose.connection.name);

      try {
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const info = await admin.buildInfo();
        console.log(`📦 MongoDB version: ${info.version}`);
      } catch (err) {
        console.warn('⚠️ Could not retrieve MongoDB version:', err.message);
      }

      console.log(`💳 Stripe API version: ${stripe.getApiField('version')}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err.message);
    process.exit(1); // Safe here — app can't proceed
  }
})();

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down...`);

  server?.close(() => {
    console.log('🚪 Closed server connections.');
  });

  try {
    await mongoose.connection.close();
    console.log('🗃️  MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // Cloud or container stop
