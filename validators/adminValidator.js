const { query, body,param  } = require('express-validator');

const userListValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1 }),
  query('status').optional().isIn(['pending', 'active', 'suspended', 'closed']),
  query('kycStatus').optional().isIn(['none', 'submitted', 'approved', 'rejected'])
];

const updateUserStatusValidator = [
  body('status')
    .isIn(['pending', 'active', 'suspended', 'closed'])
    .withMessage('Invalid status')
];

const updateKycStatusValidator = [
  body('status').isIn(['approved', 'rejected']).withMessage('Invalid KYC status'),
  body('notes').optional().isString()
];

const promoteUserValidator = [
  param('email').isEmail().withMessage('Email param must be a valid email address')
];

module.exports = {
  userListValidator,
  updateUserStatusValidator,
  updateKycStatusValidator,
  promoteUserValidator
};