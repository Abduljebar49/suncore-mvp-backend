const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const StripeEventLog = require('../../models/StripeEventLog');
const {
  handlePaymentIntentSucceeded,
  handlePaymentIntentFailed,
  handleChargeSucceeded,
  handleChargeFailed,
  handleCheckoutSessionCompleted,
} = require('../../services/paymentService');

const handleStripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers['stripe-signature'];
    // const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Save the incoming event
    await StripeEventLog.create({
      eventId: event.id,
      type: event.type,
      data: event.data.object,
    });

    // process the event based on its type
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data.object);
        break;

      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send({ received: true });
  } catch (err) {
    console.error('Webhook event handling error:', err);

    // Update event with error info
    await StripeEventLog.findOneAndUpdate(
      { eventId: event.id },
      { status: 'error', error: err.message }
    );

    res.status(500).send({ error: 'Internal Server Error' });
  }
};

module.exports = { handleStripeWebhook };
