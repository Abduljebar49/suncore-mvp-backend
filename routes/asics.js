const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/auth0');
const asicController = require('../controllers/asicController');
const { updateStatusValidator } = require('../validators/asicValidator');

/**
 * @swagger
 * tags:
 *   name: ASIC
 *   description: User-specific ASIC device management and performance
 */

/**
 * @swagger
 * /api/v1/asic:
 *   get:
 *     summary: Get paginated list of user's ASICs
 *     tags: [ASIC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of ASICs per page (default 10)
 *     responses:
 *       200:
 *         description: List of ASICs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 asics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ASIC'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */

/**
 * @swagger
 * /api/v1/asic/{asicId}:
 *   get:
 *     summary: Get details of a specific ASIC
 *     tags: [ASIC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: asicId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ASIC
 *     responses:
 *       200:
 *         description: ASIC details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 asic:
 *                   $ref: '#/components/schemas/ASIC'
 */

/**
 * @swagger
 * /api/v1/asic/{asicId}/performance:
 *   get:
 *     summary: Get performance metrics for a specific ASIC
 *     tags: [ASIC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: asicId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ASIC
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [24h, 7d, 30d]
 *           default: 7d
 *         required: false
 *         description: Time period for performance data
 *     responses:
 *       200:
 *         description: ASIC performance data for selected period
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       hashrate:
 *                         type: number
 *                       efficiency:
 *                         type: number
 */

/**
 * @swagger
 * /api/v1/asic/{asicId}/status:
 *   put:
 *     summary: Update status of a specific ASIC
 *     tags: [ASIC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: asicId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ASIC
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [online, offline, maintenance, error]
 *     responses:
 *       200:
 *         description: ASIC status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 asic:
 *                   $ref: '#/components/schemas/ASIC'
 */

router.get('/', checkJwt, asicController.getAsics);
router.get('/:asicId', checkJwt, asicController.getAsicDetails);
router.get('/:asicId/performance', checkJwt, asicController.getAsicPerformance);
router.put('/:asicId/status', checkJwt, updateStatusValidator, asicController.updateStatus);

module.exports = router;
