const { query } = require('express-validator');

const dashboardQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
];

const earningsQueryValidator = [
  query('period')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Invalid period. Allowed values: daily, weekly, monthly'),
];

module.exports = {
  dashboardQueryValidator,
  earningsQueryValidator,
};
