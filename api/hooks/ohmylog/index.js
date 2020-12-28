/**
* Usage:
* At the beginning of the file create log variable
* const log = sails.hooks.ohmylog.log('type:subtype');
*/
const map = require('lodash/map');
const defaults = require('lodash/defaultsDeep');
const logger = require('./lib/logger');

module.exports = function(sails) {
  return {
    defaults: {
      ohmylog: {
        path: 'ohmylog',
        // global config
        colors: {
          debug: 'italic blue',
          info: 'green',
          warn: 'yellowBG red',
          error: 'bold red',
          verbose: 'gray',
          silly: 'italic magenta'
        },
        levels: {
          error: 0,
          warn: 1,
          info: 2,
          debug: 3,
          verbose: 4,
          silly: 5
        },
        // logging style
        defaultLabel: 'ohmylog',
        // console defaults
        console: {
          label: 'ohmylog',
          level: process.env.CLEVEL || 'debug'
        },
        // file defaults
        file: {
          name: 'default_file',
          filename: 'logs',
          level: process.env.FLEVEL || 'silly'
        },
        // where exceptions are written
        exceptions: true,
        exceptionFilename: 'exceptions',
        // if file should rotate
        rotate: '',
        defaultPattern: 'DD_MM_YY_',
        // no more loggers
        extras: []
      }
    },

    configure: function() {
      if (sails.config.ohmylog.rotate === true) {
        sails.config.ohmylog.rotate = sails.config.ohmylog.defaultPattern;
      }

      // For extras
      for (const extraLogger of sails.config.ohmylog.extras) {
        defaults(extraLogger, {
          path: sails.config.ohmylog.path,
          file: {
            level: sails.config.ohmylog.file.level
          },
          levels: sails.config.ohmylog.levels,
          colors: sails.config.ohmylog.colors,
          defaultLabel: extraLogger.name,
          exceptions: false
        });

        if (extraLogger.file.rotate) {
          extraLogger.rotate = sails.config.ohmylog.defaultPattern;
          extraLogger.file.filename = extraLogger.name;
        }
      }
    },

    initialize: function(done) {
      const defaultLogger = logger(sails.config.ohmylog);
      const indexOfConsole = defaultLogger.transports[0].constructor.name === 'Console' ? 0 : 1;

      sails.hooks.ohmylog.default = defaultLogger;
      sails.ohmylog = {};

      for (const key in sails.config.ohmylog.levels) {
        sails.ohmylog[key] = function() {
          map(arguments, (argument) => {
            sails.hooks.ohmylog.default.log({
              level: key,
              message: argument,
              prefix: sails.config.ohmylog.defaultLabel
            });
          });
        };
      }

      if (sails.config.ohmylog.extras.length > 0) {
        sails.config.ohmylog.extras.forEach(function(extraLogger) {
          const transports = [defaultLogger.transports[1 - indexOfConsole]];

          if (extraLogger.console === true) {
            extraLogger.console = false;
            transports.push(defaultLogger.transports[indexOfConsole]);
          }

          defaultLogger.silly(`New logger: ${extraLogger.name}/${extraLogger.file.level}`);
          sails.hooks.ohmylog[extraLogger.name] = logger(extraLogger, transports);
        });
      }

      done();
    },

    log: (prefix) => {
      const wrapper = {};

      for (const key in sails.config.ohmylog.levels) {
        wrapper[key] = function () {
          map(arguments, (argument) => {
            sails.hooks.ohmylog.default.log({
              level: key,
              message: argument,
              prefix: prefix
            });
          });
        };
      }

      return wrapper;
    }
  }
};
