// controllers/authController.js
const { StatusCodes } = require('http-status-codes');
const userService = require('../services/userService');
const validateAndHandle = require('../utils/validateAndHandle');

const getCurrentUser = validateAndHandle(
  async (req, res) => {
    const auth0Id = req.auth.payload.sub;
    const user = await userService.getUserByAuth0Id(auth0Id);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    res.status(StatusCodes.OK).json({ user: userService.serializeUser(user) });
  },
  { runValidation: false }
);

module.exports = {
  getCurrentUser,
};

// //controllers/authController.js
// const { StatusCodes } = require('http-status-codes');
// const userService = require('../services/userService');
// const sendError = require('../utils/sendError');

// const getCurrentUser = async (req, res) => {
//   try {
//     const auth0Id = req.auth.payload.sub;
//     const user = await userService.getUserByAuth0Id(auth0Id);

//     if (!user) {
//       return sendError(res, StatusCodes.NOT_FOUND, 'User not found');
//     }

//     res.status(StatusCodes.OK).json({ user: userService.serializeUser(user) });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: 'Server error',
//     });
//   }
// };

// module.exports = {
//   getCurrentUser,
// };
