// utils/validateAndHandle.js
const { validationResult } = require('express-validator');
const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

const validateAndHandle = (handlerFn, options = { runValidation: true }) => {
  return async (req, res, next) => {
    try {
      if (options.runValidation) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new ApiError('Validation failed', StatusCodes.BAD_REQUEST);
        }
      }

      await handlerFn(req, res, next);
    } catch (err) {
      // Let already-known errors pass through
      if (err instanceof ApiError) {
        return next(err);
      }

      // Handle unexpected errors
      next(
        new ApiError(
          err.message || 'Unexpected error occurred',
          err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  };
};

module.exports = validateAndHandle;
