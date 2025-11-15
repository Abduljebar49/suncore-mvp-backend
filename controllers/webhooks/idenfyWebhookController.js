//controllers/webhooks/idenfyWebhookController.js
const userService = require('../../services/userService');
const IdenfyEventLog = require('../../models/IdenfyEventLog');
const ApiError = require('../../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const handleIdenfyWebhook = async (req, res) => {
  const { scanRef, status, info } = req.body;

  if (!scanRef || !status) {
    // return res.status(400).json({ message: 'Invalid iDenfy webhook payload' });
    throw new ApiError('Invalid iDenfy webhook payload', StatusCodes.BAD_REQUEST);
  }

  let eventLogEntry = null;

  try {
    // Step 1: Save the incoming event
    eventLogEntry = await IdenfyEventLog.create({
      scanRef,
      status,
      info,
      rawBody: req.body,
    });

    // Step 2: Update user KYC status
    const kycStatus =
      status === 'APPROVED' ? 'APPROVED' : status === 'DECLINED' ? 'REJECTED' : 'SUBMITTED';

    const updatedUser = await userService.updateKYCByScanRef(scanRef, {
      kycStatus,
      'kycData.metadata': info,
      'kycData.approvedAt': kycStatus === 'APPROVED' ? new Date() : null,
    });

    if (!updatedUser) {
      // Optional: Mark log as failed
      await IdenfyEventLog.findByIdAndUpdate(eventLogEntry._id, {
        processed: false,
        error: 'User not found for this scanRef',
      });

      // return res.status(404).json({ message: 'User with this scanRef not found' });
      throw new ApiError('User with this scanRef not found', StatusCodes.NOT_FOUND);
    }

    // Optional: Mark log as processed
    await IdenfyEventLog.findByIdAndUpdate(eventLogEntry._id, {
      processed: true,
    });

    return res.status(200).json({ message: 'Webhook processed' });
  } catch (err) {
    console.error('Error processing iDenfy webhook:', err);
    // throw new ApiError('Server error', StatusCodes.INTERNAL_SERVER_ERROR);

    if (eventLogEntry) {
      await IdenfyEventLog.findByIdAndUpdate(eventLogEntry._id, {
        processed: false,
        error: err.message,
      });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { handleIdenfyWebhook };

const handleIdenfyWebhookPREV = async (req, res) => {
  try {
    const { scanRef, status, info } = req.body;

    if (!scanRef || !status) {
      return res.status(400).json({ message: 'Invalid iDenfy webhook payload' });
    }

    const kycStatus =
      status === 'APPROVED' ? 'APPROVED' : status === 'DECLINED' ? 'REJECTED' : 'SUBMITTED';

    const updatedUser = await userService.updateKYCByScanRef(scanRef, {
      kycStatus,
      'kycData.metadata': info,
      'kycData.approvedAt': kycStatus === 'APPROVED' ? new Date() : null,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User with this scanRef not found' });
    }

    return res.status(200).json({ message: 'Webhook processed' });
  } catch (err) {
    console.error('Error processing iDenfy webhook:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { handleIdenfyWebhook, handleIdenfyWebhookPREV };
