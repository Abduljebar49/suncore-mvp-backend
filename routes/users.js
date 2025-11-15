// routes/user.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { checkJwt } = require('../middleware/auth0');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and settings endpoints
 */

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _id: 123
 *                 firstName: John
 *                 lastName: Doe
 *                 email: john@example.com
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/profile', checkJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/v1/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "+2348123456789"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put(
  '/profile',
  [
    checkJwt,
    body('firstName').optional().trim().isLength({ min: 2 }),
    body('lastName').optional().trim().isLength({ min: 2 }),
    body('phone').optional().isMobilePhone(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, phone } = req.body;
      const updateData = {};
      if (firstName) {
        updateData.firstName = firstName;
      }
      if (lastName) {
        updateData.lastName = lastName;
      }
      if (phone) {
        updateData.phone = phone;
      }

      const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
        new: true,
        runValidators: true,
      }).select('-password');

      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /api/v1/user/preferences:
 *   put:
 *     summary: Update user preferences
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notifications:
 *                 type: boolean
 *               payoutFrequency:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *               currency:
 *                 type: string
 *                 example: "USD"
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       500:
 *         description: Server error
 */
router.put('/preferences', checkJwt, async (req, res) => {
  try {
    const { notifications, payoutFrequency, currency } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          'preferences.notifications': notifications,
          'preferences.payoutFrequency': payoutFrequency,
          'preferences.currency': currency,
        },
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Preferences updated successfully', user });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/v1/user/wallet:
 *   put:
 *     summary: Update user's Bitcoin wallet address
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 minLength: 26
 *                 maxLength: 62
 *                 example: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT"
 *     responses:
 *       200:
 *         description: Wallet address updated successfully
 *       400:
 *         description: Invalid address
 *       500:
 *         description: Server error
 */
router.put(
  '/wallet',
  [
    checkJwt,
    body('walletAddress')
      .isLength({ min: 26, max: 62 })
      .withMessage('Invalid Bitcoin wallet address'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { walletAddress } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { walletAddress },
        { new: true, runValidators: true }
      ).select('-password');

      res.json({ message: 'Wallet address updated successfully', user });
    } catch (error) {
      console.error('Update wallet error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;

// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const User = require('../models/User');
// const { checkJwt } = require('../middleware/auth0');

// const router = express.Router();

// // Get user profile
// router.get('/profile', checkJwt, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ user });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update user profile
// router.put(
//   '/profile',
//   [
//     checkJwt,
//     body('firstName').optional().trim().isLength({ min: 2 }),
//     body('lastName').optional().trim().isLength({ min: 2 }),
//     body('phone').optional().isMobilePhone(),
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       const { firstName, lastName, phone } = req.body;
//       const updateData = {};

//       if (firstName) {
//         updateData.firstName = firstName;
//       }
//       if (lastName) {
//         updateData.lastName = lastName;
//       }
//       if (phone) {
//         updateData.phone = phone;
//       }

//       const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
//         new: true,
//         runValidators: true,
//       }).select('-password');

//       res.json({ message: 'Profile updated successfully', user });
//     } catch (error) {
//       console.error('Update profile error:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   }
// );

// // Update user preferences
// router.put('/preferences', checkJwt, async (req, res) => {
//   try {
//     const { notifications, payoutFrequency, currency } = req.body;

//     const user = await User.findByIdAndUpdate(
//       req.user.userId,
//       {
//         $set: {
//           'preferences.notifications': notifications,
//           'preferences.payoutFrequency': payoutFrequency,
//           'preferences.currency': currency,
//         },
//       },
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.json({ message: 'Preferences updated successfully', user });
//   } catch (error) {
//     console.error('Update preferences error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update wallet address
// router.put(
//   '/wallet',
//   [
//     checkJwt,
//     body('walletAddress')
//       .isLength({ min: 26, max: 62 })
//       .withMessage('Invalid Bitcoin wallet address'),
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       const { walletAddress } = req.body;

//       const user = await User.findByIdAndUpdate(
//         req.user.userId,
//         { walletAddress },
//         { new: true, runValidators: true }
//       ).select('-password');

//       res.json({ message: 'Wallet address updated successfully', user });
//     } catch (error) {
//       console.error('Update wallet error:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   }
// );

// module.exports = router;
