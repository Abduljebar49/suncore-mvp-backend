//utils/sendEError.js
module.exports = function sendError(res, statusCode, messageOrArray) {
  return res
    .status(statusCode)
    .json(Array.isArray(messageOrArray) ? { errors: messageOrArray } : { message: messageOrArray });
};
