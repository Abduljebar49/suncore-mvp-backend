const { body } = require('express-validator');

const updateStatusValidator = [
  body('status')
    .isIn(['online', 'offline', 'maintenance', 'error'])
    .withMessage('Invalid ASIC status'),
];

module.exports = { updateStatusValidator };
