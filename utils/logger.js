//utils/logger.js
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const Sentry = require('@sentry/node');

// Custom Winston transport that forwards errors to Sentry
class SentryTransport extends transports.Console {
  log(info, callback) {
    setImmediate(() => {
      if (info.level === 'error') {
        const error = info instanceof Error ? info : new Error(info.message);
        error.stack = info.stack || error.stack;
        Sentry.captureException(error);
      }
    });
    callback();
  }
}

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  defaultMeta: { service: 'suncore-api' },
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
    ...(process.env.NODE_ENV === 'development'
      ? [new transports.Console({ format: format.simple() })]
      : []),
    ...(process.env.NODE_ENV === 'production' ? [new SentryTransport({ level: 'error' })] : []),
  ],
});

module.exports = logger;

// const { createLogger, format, transports } = require('winston');

// const logger = createLogger({
//   level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
//   format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
//   defaultMeta: { service: 'suncore-api' },
//   transports: [
//     new transports.File({ filename: 'logs/error.log', level: 'error' }),
//     new transports.File({ filename: 'logs/combined.log' }),
//     ...(process.env.NODE_ENV === 'development'
//       ? [new transports.Console({ format: format.simple() })]
//       : []),
//   ],
// });

// module.exports = logger;
