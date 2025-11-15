const express = require('express');
const { checkJwt } = require('../middleware/auth0');
const { getDashboard, getEarnings } = require('../controllers/miningController');
const {
  dashboardQueryValidator,
  earningsQueryValidator,
} = require('../validators/miningValidator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mining
 *   description: User-specific mining performance and earnings analytics
 */

/**
 * @swagger
 * /api/v1/mining/dashboard:
 *   get:
 *     summary: Get mining dashboard stats for authenticated user
 *     tags: [Mining]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Page number for ASIC list pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Mining dashboard summary with ASIC list and performance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalHashrate:
 *                       type: number
 *                     activeAsics:
 *                       type: number
 *                     totalAsics:
 *                       type: number
 *                     totalEarnings:
 *                       type: number
 *                     avgUptime:
 *                       type: number
 *                 asics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ASIC'
 *                 performanceData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Date string (YYYY-MM-DD)
 *                       avgHashrate:
 *                         type: number
 *                       totalEarnings:
 *                         type: number
 *                       avgEfficiency:
 *                         type: number
 */

/**
 * @swagger
 * /api/v1/mining/earnings:
 *   get:
 *     summary: Get earnings by daily, weekly, or monthly period
 *     tags: [Mining]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: monthly
 *         required: false
 *         description: Group earnings data by period
 *     responses:
 *       200:
 *         description: Aggregated earnings data by selected period
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
 *                       _id:
 *                         type: string
 *                         description: Period label (e.g. "2024-07", "2024-W29")
 *                       grossEarnings:
 *                         type: number
 *                       usdValue:
 *                         type: number
 *                       poolFees:
 *                         type: number
 *                       managementFees:
 *                         type: number
 *                       netEarnings:
 *                         type: number
 */

// GET /mining/dashboard (with pagination)
router.get('/dashboard', checkJwt, dashboardQueryValidator, getDashboard);

// GET /mining/earnings?period=monthly|weekly|daily
router.get('/earnings', checkJwt, earningsQueryValidator, getEarnings);

module.exports = router;
