const FIXED_LENGTH = 25;
const path = require('path');
const prettyJSON = require('prettyjson');
const winston = require('winston');
// noinspection SpellCheckingInspection
const { printf, combine, timestamp } = winston.format;
const DailyRotateFile = require('winston-daily-rotate-file');
// Format functions
const addDots = printf((info) => {
  let level = `${info.prefix || info.label}`;

  for (let i = level.length; i <= FIXED_LENGTH; i++) {
    level += '.';
  }

  info.level = level;
});
const showLg = printf(info => {
  if (typeof info.message === 'object') {
    return prettyJSON.render(info.message, {
      keysColor: 'yellow',
      stringColor: 'gray',
      dashColor: 'yellow',
      numberColor: 'cyan'
    }, 3);
  }

  return `${info.timestamp} ${info.level} ${info.message}`;
});

module.exports = function(opts, transports = []) {
  winston.addColors(opts.colors);
  transports.push(new DailyRotateFile({
    filename: path.resolve(opts.path, `%DATE%${opts.file.filename}.log`),
    datePattern: opts.rotate,
    level: opts.file.level,
    json: false,
    prettyPrint: true,
    colorize: false
  }));

  if (opts.console) {
    const consoleLogger = new winston.transports.Console({
      level: opts.console.level,
      colorize: true,
      prettyPrint: true
    });

    transports.push(consoleLogger);
  }

  const logger = winston.createLogger({
    levels: opts.levels,
    exitOnError: false,
    format: combine(
      winston.format.label({label: opts.defaultLabel}),
      timestamp(),
      addDots,
      winston.format.prettyPrint(),
      winston.format.colorize(),
      showLg
    ),
    transports: transports
  });

  if (opts.exceptions) {
    winston.exceptions.handle(new winston.transports.File({
      filename: path.resolve(opts.path, `${opts.exceptionFilename}.log`),
      json: false,
      prettyPrint: true,
      colorize: false
    }));
  }

  return logger;
};
