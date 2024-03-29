const {createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
level: process.env.LOG_LEVEL || 'info',
format: combine(
label({ label: 'Logger' }),
timestamp(),
myFormat
),
transports: [   new transports.File({
    filename: 'info.log',
    level: 'info'
  }),
  new transports.File({
    filename: 'errors.log',
    level: 'error'
  }),
    new transports.Console()]
});

module.exports = logger