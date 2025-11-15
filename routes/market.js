const express = require('express');
const controller = require('../controllers/marketController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Market
 *   description: Market data, BTC stats, and profitability estimates
 */

/**
 * @swagger
 * /api/v1/market/btc-price:
 *   get:
 *     summary: Get real-time BTC price and stats
 *     tags: [Market]
 *     responses:
 *       200:
 *         description: Returns BTC price, 24h volume and price change
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 price:
 *                   type: number
 *                   example: 42350.25
 *                 priceChange:
 *                   type: number
 *                   example: -500.12
 *                 priceChangePercent:
 *                   type: number
 *                   example: -1.18
 *                 high24h:
 *                   type: number
 *                   example: 43000
 *                 low24h:
 *                   type: number
 *                   example: 41800
 *                 volume24h:
 *                   type: number
 *                   example: 1200.5
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/v1/market/btc-history:
 *   get:
 *     summary: Get historical BTC price chart data
 *     tags: [Market]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [1d, 1w, 1m, 3m, 1y, 5y]
 *           default: 1y
 *         description: Time range of price history
 *     responses:
 *       200:
 *         description: Returns array of price points for selected period
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       price:
 *                         type: number
 *                       volume:
 *                         type: number
 */

/**
 * @swagger
 * /api/v1/market/network-stats:
 *   get:
 *     summary: Get mock Bitcoin network stats
 *     tags: [Market]
 *     responses:
 *       200:
 *         description: Hashrate, difficulty, block height, mempool, fees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hashrate:
 *                   type: string
 *                   example: 525.2 EH/s
 *                 difficulty:
 *                   type: string
 *                   example: 73.2T
 *                 blockHeight:
 *                   type: number
 *                   example: 825000
 *                 nextHalving:
 *                   type: object
 *                   properties:
 *                     estimatedDate:
 *                       type: string
 *                       example: 2028-04-15
 *                     blocksRemaining:
 *                       type: number
 *                       example: 315000
 *                 mempool:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: number
 *                     size:
 *                       type: string
 *                 fees:
 *                   type: object
 *                   properties:
 *                     fast:
 *                       type: number
 *                     medium:
 *                       type: number
 *                     slow:
 *                       type: number
 */

/**
 * @swagger
 * /api/v1/market/asic-profitability:
 *   get:
 *     summary: Get ASIC profitability stats
 *     tags: [Market]
 *     parameters:
 *       - in: query
 *         name: model
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional ASIC model slug (e.g. antminer-s21e-xp-hyd)
 *     responses:
 *       200:
 *         description: ASIC stats or full list if model is omitted
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     model:
 *                       type: string
 *                     hashrate:
 *                       type: number
 *                     dailyRevenue:
 *                       type: number
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       model:
 *                         type: string
 *                       hashrate:
 *                         type: number
 *                       dailyRevenue:
 *                         type: number
 */

router.get('/btc-price', controller.getBtcPrice);
router.get('/btc-history', controller.getBtcHistory);
router.get('/network-stats', controller.getNetworkStats);
router.get('/asic-profitability', controller.getAsicProfitability);

module.exports = router;

// const express = require('express');
// const controller = require('../controllers/marketController');

// const router = express.Router();

// router.get('/btc-price', controller.getBtcPrice);
// router.get('/btc-history', controller.getBtcHistory);
// router.get('/network-stats', controller.getNetworkStats);
// router.get('/asic-profitability', controller.getAsicProfitability);

// module.exports = router;
