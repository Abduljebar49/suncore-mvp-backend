const { StatusCodes } = require('http-status-codes');
const logger = require('./logger');
const { v4: uuidv4 } = require('uuid');

const errorHandler = (err, req, res, next) => {
  const traceId = uuidv4();

  // Default status
  let statusCode =
    err.statusCode ||
    err.status ||
    (err.name === 'UnauthorizedError'
      ? StatusCodes.UNAUTHORIZED
      : StatusCodes.INTERNAL_SERVER_ERROR);

  let message = err.message || 'Internal server error';

  // Customize known token errors
  if (err.name === 'InvalidTokenError' || err.name === 'UnauthorizedError') {
    if (message.includes('"exp"')) {
      message = 'Access token has expired. Please login again.';
    } else if (message.includes('signature verification failed')) {
      message = 'Invalid token. Please login again or check your credentials.';
    } else {
      message = 'Authentication failed. Please provide a valid access token.'; //testing without token
    }

    statusCode = StatusCodes.UNAUTHORIZED;
  }

  // Log error
  logger.error('Unhandled error', {
    traceId,
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    ip: req.ip,
  });

  // Build standardized error response
  const responseBody = {
    status: 'error',
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    traceId,
    method: req.method,
    url: req.originalUrl,
  };

  if (process.env.NODE_ENV === 'development') {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

module.exports = errorHandler;

// // utils/errorHandler.js
// const { StatusCodes } = require('http-status-codes');
// const logger = require('./logger');
// const { v4: uuidv4 } = require('uuid');

// const errorHandler = (err, req, res, next) => {
//   const statusCode =
//     err.statusCode ||
//     err.status ||
//     (err.name === 'UnauthorizedError'
//       ? StatusCodes.UNAUTHORIZED
//       : StatusCodes.INTERNAL_SERVER_ERROR);

//   // Generate a traceId for correlation
//   const traceId = uuidv4();

//   // Log error
//   logger.error('Unhandled error', {
//     traceId,
//     message: err.message,
//     stack: err.stack,
//     method: req.method,
//     url: req.originalUrl,
//     statusCode,
//     ip: req.ip,
//   });

//   // Build standardized error response
//   const responseBody = {
//     status: 'error',
//     message: err.message || 'Internal server error',
//     timestamp: new Date().toISOString(),
//     traceId,
//     request: {
//       method: req.method,
//       url: req.originalUrl,
//     },
//   };

//   if (process.env.NODE_ENV === 'development') {
//     responseBody.stack = err.stack;
//   }

//   res.status(statusCode).json(responseBody);
// };

// module.exports = errorHandler;
