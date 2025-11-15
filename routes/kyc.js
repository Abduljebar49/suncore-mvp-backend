// //routes/kyc.js

const express = require('express');
const { kycSubmissionValidator, kycCompleteTrackValidator } = require('../validators/kycValidator');
const {
  getKYCStatus,
  startKYC,
  trackKycCompletion,
} = require('../controllers/kycController/kycController');
const { checkJwt } = require('../middleware/auth0');
const ensureUserExists = require('../middleware/ensureUserExists');

const router = express.Router();

router.use(checkJwt, ensureUserExists);

/**
 * @swagger
 * tags:
 *   name: KYC
 *   description: Endpoints related to KYC verification process
 */

/**
 * @swagger
 * /api/v1/kyc/status:
 *   get:
 *     summary: Get current user's KYC status (***Ready for QA test***)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved KYC status
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 status: submitted
 *                 email: user@example.com
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/kyc/start:
 *   post:
 *     summary: Start a new KYC session with iDenfy
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - documentType
 *               - documentNumber
 *               - dateOfBirth
 *               - address
 *               - country
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               documentType:
 *                 type: string
 *                 example: PASSPORT
 *               documentNumber:
 *                 type: string
 *                 example: X1234567
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               address:
 *                 type: string
 *                 example: 123 Main St, Lagos
 *               country:
 *                 type: string
 *                 example: NG
 *     responses:
 *       200:
 *         description: KYC session started successfully
 *         content:
 *           application/json:
 *             example:
 *               message: KYC started successfully
 *               redirectUrl: https://ivs.idenfy.com/api/v2/redirect?authToken=xxx
 *               scanRef: KYC_16234234_sdf1sd1
 *               token: xyz
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/kyc/track-kyc-completion:
 *   post:
 *     summary: Track and log user's KYC completion
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scanRef
 *             properties:
 *               scanRef:
 *                 type: string
 *                 format: uuid
 *                 example: 8d569c2a-8ef4-11ec-9b56-0242ac120002
 *     responses:
 *       200:
 *         description: KYC completion tracked successfully or already logged
 *         content:
 *           application/json:
 *             example:
 *               message: KYC completion tracked successfully
 *       400:
 *         description: Missing or invalid scanRef
 *       500:
 *         description: Server error
 */

router.get('/status', getKYCStatus);
router.post('/start', kycSubmissionValidator, startKYC);
router.post('/track-kyc-completion', kycCompleteTrackValidator, trackKycCompletion);

module.exports = router;
