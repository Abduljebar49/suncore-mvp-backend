const { body } = require('express-validator');

const createIntentValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').isIn(['USD', 'EUR', 'GBP']).withMessage('Invalid currency'),
  body('asicModel').notEmpty().withMessage('ASIC model is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

module.exports = { createIntentValidation };
