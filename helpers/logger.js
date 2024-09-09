const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logFormat = format.combine(
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}] ${message}`;
  }),
);

const accessLogTransport = new DailyRotateFile({
  level: 'info',
  filename: './logs/access-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  format: logFormat,
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const errorLogTransport = new DailyRotateFile({
  level: 'error',
  filename: './logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  format: logFormat,
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const log = createLogger({
  transports: [accessLogTransport, errorLogTransport],
});

log.add(
  new transports.Console({
    format: format.cli(),
  }),
);

module.exports = {
  log: log,
};
