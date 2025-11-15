const express = require('express');
const { checkJwt } = require('../middleware/auth0');
const ensureUserExists = require('../middleware/ensureUserExists');
const { getCurrentUser } = require('../controllers/authController');

const router = express.Router();

router.use(checkJwt, ensureUserExists);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication-related endpoints using Auth0
 */

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get the currently authenticated user (***Ready for QA test***)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the authenticated user
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _id: 64f123abc456
 *                 firstName: John
 *                 lastName: Doe
 *                 email: john@example.com
 *                 role: user
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */
router.get('/me', getCurrentUser);

module.exports = router;
