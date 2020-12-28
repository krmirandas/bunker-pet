/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 */

const chalk = require('chalk');
const morgan = require('morgan');
const multer = require('multer');
const busboy = require('busboy-body-parser');
const skipper = require('skipper');
const Qs = require('qs');

function colorStatus(status) {
  if (status < 300) {
    return chalk.green(status); // 2xx
  } else if (status < 400) {
    return chalk.cyan(status); // 3xx
  } else if (status < 500) {
    return chalk.yellow(status); // 4xx
  }

  return chalk.red(status); // 5xx
}

function colorTime(time) {
  if (time < 300) {
    return chalk.green(time + ' ms');
  } else if (time < 1000) {
    return chalk.yellow(time + ' ms');
  }

  return chalk.red(time + ' ms');
}

module.exports.http = {
  middleware: {
    order: [
      'morganLogger',
      'fileParser',
      'bodyParser',
      'multiParser',
      '$custom',
      'myRequestLogger',
      'router'
    ],

    myRequestLogger: function(req, res, next) {
      if (req.method + ' ' + req.path === 'GET /status') {
        return next();
      }
      sails.hooks.ohmylog.request.info('Requested ' + req.method + ' ' + req.path);
      sails.hooks.ohmylog.request.silly('Agent: ' + req.headers['user-agent']);
      sails.hooks.ohmylog.request.silly('Arguments in body:');
      sails.hooks.ohmylog.request.info(req.body || {});
      sails.hooks.ohmylog.request.silly('Arguments in query:');
      sails.hooks.ohmylog.request.info(req.query || {});
      const files = req.files ? Object.keys(req.files).reduce((obj, key) => {
        return {
          ...obj,
          [key]: req.files[key].name
        };
      }, {}) : [];
      req.on('aborted', () => {
        sails.hooks.ohmylog.request.error('Request ' + req.method + ' ' + req.path + ' ABORTED');
      });

      return next();
    },

    /****************************************************************************
     *                                                                           *
     *                             FILE PARSER                                   *
     *                                                                           *
     ****************************************************************************/
    fileParser: busboy({
      multi: false,
      limit: '1mb'
    }),

    bodyParser: (function _configureBodyParser() {
      const middlewareFn = skipper({
        limit: 10000000,
        parameterLimit: 10000,
        strict: true
      });

      return middlewareFn;
    })(),

    multiParser: function(req, res, next) {
      if (req.is('multipart/form-data')) {
        req.body = Qs.parse(req.body);
      }
      return next();
    },

    morganLogger: morgan(function(tokens, req, res) {
      if (req.path == '/status') {
        return " ";
      }
      return [
        tokens.method(req, res),
        req.path,
        colorStatus(tokens.status(req, res)),
        '-',
        colorTime(tokens['response-time'](req, res))
      ].join(' ');
    }, {
      stream: {
        write: function(profile) {
          if (profile != " \n") {
            sails.hooks.ohmylog.request.info(profile);
          }
        }
      }
    })
  }
};
