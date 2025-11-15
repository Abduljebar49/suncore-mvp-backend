//routes/webhook.js
const express = require('express');
const { handleStripeWebhook } = require('../controllers/webhooks/stripeWebhookController');
const { handleIdenfyWebhook } = require('../controllers/webhooks/idenfyWebhookController');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
// const FRONTEND_URL = 'http://localhost:3000';

const router = express.Router();
// const bodyParser = require('body-parser');

// Stripe requires the raw body to validate signature
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.post('/idenfy', handleIdenfyWebhook);
router.get('/kyc/success', (req, res) => {
  const { userId, scanRef } = req.query;
  return res.redirect(`${FRONTEND_URL}/dashboard/kyc/success?userId=${userId}&scanRef=${scanRef}`);
});

router.get('/kyc/error', (req, res) => {
  const { userId, scanRef } = req.query;
  return res.redirect(`${FRONTEND_URL}/dashboard/kyc/error?userId=${userId}&scanRef=${scanRef}`);
});

module.exports = router;
