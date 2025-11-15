// //validators/kycValidator.js

// validators/kycValidator.js
const { body } = require('express-validator');

const allowedDocTypes = [
  'ID_CARD',
  'PASSPORT',
  'RESIDENCE_PERMIT',
  'DRIVER_LICENSE',
  'PAN_CARD',
  'AADHAAR',
  'VISA',
  'NATIONAL_PASSPORT',
  'PROVISIONAL_DRIVER_LICENSE',
  'OLD_ID_CARD',
  'MILITARY_CARD',
  'ADDRESS_CARD',
  'BANK_ID_SE',
];

const alpha2CountryCodeRegex = /^[A-Z]{2}$/i;

const kycSubmissionValidator = [
  body('firstName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name must be 1–100 characters and contain only valid characters'),

  body('lastName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name must be 1–100 characters and contain only valid characters'),

  body('documentType').isIn(allowedDocTypes), // All UPPERCASE

  // body('documentType')
  //   .isIn(allowedDocTypes)
  //   .withMessage(`Invalid document type. Allowed: ${allowedDocTypes.join(', ')}`),

  body('documentNumber')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Document number is required and must be between 1 and 50 characters'),

  body('dateOfBirth')
    .isISO8601({ strict: true })
    .withMessage('Date of birth must be in YYYY-MM-DD format'),

  body('address')
    .isString()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Address is required and must not exceed 255 characters'),

  body('country')
    .matches(alpha2CountryCodeRegex)
    .withMessage('Country must be a valid 2-letter ISO code (e.g., "US", "NG")'),
];

const kycCompleteTrackValidator = [
  body('scanRef').isUUID().withMessage('scanRef must be a valid UUID'),
];

module.exports = { kycSubmissionValidator, kycCompleteTrackValidator };
