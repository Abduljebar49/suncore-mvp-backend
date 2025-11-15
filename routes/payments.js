const express = require('express');
const { checkJwt } = require('../middleware/auth0');
const ensureUserExists = require('../middleware/ensureUserExists');
const { createPaymentIntent, getPaymentHistory } = require('../controllers/paymentController');
const { createIntentValidation } = require('../validators/paymentValidator');

const router = express.Router();

router.use(checkJwt, ensureUserExists);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Endpoints for creating payments and viewing payment history
 */

/**
 * @swagger
 * /api/v1/payments/create-intent:
 *   post:
 *     summary: Create a Stripe PaymentIntent for ASIC purchase (***Ready for QA test (Visa Card Payment)***)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *               - asicModel
 *               - quantity
 *               - unitPrice
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               currency:
 *                 type: string
 *                 example: USD
 *               asicModel:
 *                 type: string
 *                 example: Antminer S19 Pro
 *               quantity:
 *                 type: number
 *                 example: 2
 *               unitPrice:
 *                 type: number
 *                 example: 2500
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             example:
 *               clientSecret: pi_1HX...secret_xxx
 *               paymentId: 64b0e32b5a7a123456789
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error during Stripe payment intent creation
 */
router.post('/create-intent', createIntentValidation, createPaymentIntent);

/**
 * @swagger
 * /api/v1/payments/history:
 *   get:
 *     summary: Get user's payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of results per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: type
 *         in: query
 *         description: Optional filter by payment type (e.g. "purchase")
 *         required: false
 *         schema:
 *           type: string
 *           example: purchase
 *     responses:
 *       200:
 *         description: Payment history retrieved
 *         content:
 *           application/json:
 *             example:
 *               payments:
 *                 - _id: 64b0e32b5a7a123456789
 *                   amount: 5000
 *                   currency: USD
 *                   type: purchase
 *                   status: completed
 *                   createdAt: 2024-07-01T10:00:00Z
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 3
 *                 pages: 1
 *       500:
 *         description: Server error while fetching history
 */
router.get('/history', getPaymentHistory);

module.exports = router;
