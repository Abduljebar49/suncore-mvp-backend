//services/stripeService.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createIntent = ({ amount, currency, userId, metadata }) => {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    metadata: {
      userId, // String like "auth0|abc123"
      ...Object.fromEntries(Object.entries(metadata).map(([k, v]) => [k, v.toString()])),
    },
  });
};

module.exports = { createIntent };
