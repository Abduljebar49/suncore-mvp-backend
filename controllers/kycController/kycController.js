// controllers/kycController.js
const userService = require('../../services/userService');
const idenfyService = require('../../services/idenfyService');
const ApiError = require('../../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const KycLog = require('../../models/KycLogs');
const validateAndHandle = require('../../utils/validateAndHandle');

const startKYC = validateAndHandle(
  async (req, res) => {
    const { firstName, lastName, documentType, documentNumber, dateOfBirth, address, country } =
      req.body;

    const userId = req.auth.payload.sub;
    const verificationId = `KYC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { scanRef, authToken, metadata } = await idenfyService.startKYCSession({
      clientId: userId,
      firstName,
      lastName,
      documentType,
      documentNumber,
      dateOfBirth,
      address,
      country,
      verificationId,
    });

    await userService.updateKYC(userId, {
      documentType,
      documentNumber,
      verificationId: scanRef,
      submittedAt: new Date(),
      metadata,
    });

    return res.status(200).json({
      message: 'KYC started successfully',
      redirectUrl: `https://ivs.idenfy.com/api/v2/redirect?authToken=${authToken}`,
      scanRef,
      token: authToken,
    });
  },
  { runValidation: true }
);

const trackKycCompletion = validateAndHandle(
  async (req, res) => {
    const { scanRef } = req.body;
    const user = req.user;

    if (!user || !scanRef) {
      throw new ApiError('Missing user or scanRef', StatusCodes.BAD_REQUEST);
    }

    if (user.kycData.verificationId !== scanRef) {
      throw new ApiError('Invalid scanRef for this user', StatusCodes.BAD_REQUEST);
    }

    const alreadyLogged = await KycLog.findOne({ userId: user._id, scanRef });
    if (alreadyLogged) {
      return res.status(200).json({ message: 'KYC already tracked' });
    }

    await KycLog.create({ userId: user._id, scanRef });

    return res.status(200).json({ message: 'KYC completion tracked successfully' });
  },
  { runValidation: false }
);

const getKYCStatus = validateAndHandle(
  async (req, res) => {
    const data = await userService.getKYCStatus(req.auth.payload.sub);

    if (!data) {
      throw new ApiError('User not found or no KYC data', StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  },
  { runValidation: false }
);

module.exports = {
  getKYCStatus,
  startKYC,
  trackKycCompletion,
};

// //controllers/kycController.js
// const { validationResult } = require('express-validator');
// const userService = require('../../services/userService');
// const idenfyService = require('../../services/idenfyService');
// const ApiError = require('../../utils/ApiError');
// const { StatusCodes } = require('http-status-codes');
// const KycLog = require('../../models/KycLogs');

// const startKYC = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     throw new ApiError('Validation failed', StatusCodes.BAD_REQUEST);
//   }

//   const { firstName, lastName, documentType, documentNumber, dateOfBirth, address, country } =
//     req.body;

//   try {
//     const userId = req.auth.payload.sub;

//     const verificationId = `KYC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

//     const { scanRef, authToken, metadata } = await idenfyService.startKYCSession({
//       clientId: userId,
//       firstName,
//       lastName,
//       documentType,
//       documentNumber,
//       dateOfBirth,
//       address,
//       country,
//       verificationId,
//     });

//     await userService.updateKYC(userId, {
//       documentType,
//       documentNumber,
//       verificationId: scanRef,
//       submittedAt: new Date(),
//       metadata,
//     });

//     return res.status(200).json({
//       message: 'KYC started successfully',
//       redirectUrl: `https://ivs.idenfy.com/api/v2/redirect?authToken=${authToken}`,
//       scanRef,
//       token: authToken,
//     });
//   } catch (error) {
//      throw new ApiError('Failed to start KYC process', StatusCodes.INTERNAL_SERVER_ERROR);
//   }
// };

// const trackKycCompletion = async (req, res) => {
//   try {
//     const { scanRef } = req.body;
//     const user = req.user; // comes from ensureUserExists middleware

//     if (!user || !scanRef) {
//        throw new ApiError('Missing user or scanRef', StatusCodes.BAD_REQUEST);
//     }

//     // ✅ Step 1: Check if user's scanRef matches
//     if (user.kycData.verificationId !== scanRef) {
//        throw new ApiError('Invalid scanRef for this user', StatusCodes.BAD_REQUEST);
//     }

//     // ✅ Step 2: Prevent duplicate logging (optional but good)
//     const alreadyLogged = await KycLog.findOne({ userId: user._id, scanRef });
//     if (alreadyLogged) {
//       return res.status(200).json({ message: 'KYC already tracked' });
//     }

//     // ✅ Step 3: Log the completion
//     await KycLog.create({ userId: user._id, scanRef });

//     // ✅ Step 4: Optionally update user status here
//     // user.kycStatus = 'completed';
//     // await user.save();

//     res.status(200).json({ message: 'KYC completion tracked successfully' });
//   } catch (err) {
//      if (!err.statusCode) {
//     throw new ApiError('Unexpected error in trackKycCompletion', 500);
//   }
//  throw err; // Already handled by global errorHandler
//   }
// };

// const getKYCStatus = async (req, res) => {
//   try {
//     const data = await userService.getKYCStatus(req.auth.payload.sub);

//      if (!data) {
//       throw new ApiError('User not found or no KYC data', StatusCodes.NOT_FOUND);
//     }

//     res.status(StatusCodes.OK).json({
//       status: 'success',
//       data,
//     });
//   } catch (error) {
//      throw new ApiError('Failed to retrieve KYC status', StatusCodes.INTERNAL_SERVER_ERROR);
//   }
// };

// module.exports = {
//   getKYCStatus,
//   startKYC,
//   trackKycCompletion,
// };
