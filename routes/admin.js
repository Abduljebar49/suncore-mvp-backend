//routes/admin.js
const express = require('express');
const {
  getDashboard,
  getUsers,
  updateUserStatus,
  updateKycStatus,
  promoteUser,
} = require('../controllers/adminController');
const getStripeEvents = require('../controllers/stripeEventController');
const {
  userListValidator,
  updateUserStatusValidator,
  updateKycStatusValidator,
  promoteUserValidator,
} = require('../validators/adminValidator');
const ensureUserExists = require('../middleware/ensureUserExists');
const { adminAuth } = require('../middleware/auth0');

const router = express.Router();

router.use(...adminAuth, ensureUserExists);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only operations
 */

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard metrics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     active:
 *                       type: integer
 *                     pendingKYC:
 *                       type: integer
 *                 asics:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     online:
 *                       type: integer
 *                     offline:
 *                       type: integer
 *                 revenue:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 */

/**
 * @swagger
 * /api/v1/admin/stripe-events:
 *   get:
 *     summary: Get list of Stripe webhook events
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of Stripe events
 */

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get paginated list of users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, suspended, closed]
 *       - in: query
 *         name: kycStatus
 *         schema:
 *           type: string
 *           enum: [not_submitted, submitted, approved, rejected]
 *     responses:
 *       200:
 *         description: Paginated user list
 */

/**
 * @swagger
 * /api/v1/admin/users/{userId}/status:
 *   put:
 *     summary: Update user account status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, active, suspended, closed]
 *     responses:
 *       200:
 *         description: User status updated
 */

/**
 * @swagger
 * /api/v1/admin/users/{userId}/kyc:
 *   put:
 *     summary: Update KYC status of a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: KYC status updated
 */

/**
 * @swagger
 * /api/v1/admin/promote/{email}:
 *   put:
 *     summary: Promote user to admin (by path param)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User promoted to admin
 */

/**
 * @swagger
 * /api/v1/admin/promote:
 *   put:
 *     summary: Promote user to admin (by query param)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User promoted to admin
 */

router.get('/dashboard', getDashboard);
router.get('/stripe-events', getStripeEvents);
router.get('/users', userListValidator, getUsers);
router.put('/users/:userId/status', updateUserStatusValidator, updateUserStatus);
router.put('/users/:userId/kyc', updateKycStatusValidator, updateKycStatus);
router.put('/promote/:email', promoteUserValidator, promoteUser);
router.put('/promote', promoteUserValidator, promoteUser);

module.exports = router;

// //routes/admin.js
// const express = require('express');
// const {
//   getDashboard,
//   getUsers,
//   updateUserStatus,
//   updateKycStatus,
//   promoteUser,
// } = require('../controllers/adminController');
// const getStripeEvents = require('../controllers/stripeEventController');
// const {
//   userListValidator,
//   updateUserStatusValidator,
//   updateKycStatusValidator,
//   promoteUserValidator,
// } = require('../validators/adminValidator');
// const ensureUserExists = require('../middleware/ensureUserExists');
// const { adminAuth } = require('../middleware/auth0');

// const router = express.Router();

// router.use(...adminAuth, ensureUserExists);

// router.get('/dashboard', getDashboard);
// router.get('/stripe-events', getStripeEvents);
// router.get('/users', userListValidator, getUsers);
// router.put('/users/:userId/status', updateUserStatusValidator, updateUserStatus);
// router.put('/users/:userId/kyc', updateKycStatusValidator, updateKycStatus);
// // support both /promote/:email and /promote?email=...
// router.put('/promote/:email', promoteUserValidator, promoteUser);
// router.put('/promote', promoteUserValidator, promoteUser);

// module.exports = router;
