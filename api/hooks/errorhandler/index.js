/**
 * Manages errors to be used with res.negotiate
 */

/**
 * Code ids for models
 *
   1 - Player
   2 - Reservation
   3 - Category
   4 - Game
   5 - PurchasedTime
   6 - Timer
   7 - Service
   8 - Station
   9 - System
   10 - CheckIn
   11 - Match
   12 - Team
   13 - Tournament
   14 - GameSystem
   15 - TimeLog
   16 - TimeProduct
   17 - AccessKey
   18 - IdCard
   19 - location
   20 - Transaction
   21 - User
   22 - Recharge
   23 - Schedule
 *
 */
const notFoundFrom = {
  params: 102,
  body: 103,
  query: 104,
  plain: 100
};

class ErrorHandler {
  /**
   * @param codeString  -  Name of HTTP status code
   * @param message     -  Message to send in response
   * @param meta        -  Metadata for messages
   * @param debug       -  Data to log, only for internal use
   * @param icode       -  Internal code for detailed info
   * @param errors      -  Desglosed errors
   */
  constructor(codeString, message, code, type, errors = []) {
    this.name = 'ErrorHandler';
    this.codeString = codeString;
    this.message = message || 'unexpected_error';
    this.errors = errors;
    this.code = code;
    this.type = type;

    const stack = new Error(codeString).stack.split('\n');

    this.trace = stack.slice(2, 5);
  }

  status() {
    const status = typeof this.codeString == 'number'
      ? this.codeString
      : sails.config.errorhandler[this.codeString];

    if (!status) {
      sails.ohmylog.error('Missing code for ' + this.codeString + ' sending 500');
      return 500;
    }

    return status;
  }

  respond(t) {
    sails.ohmylog.error('Responding for ' + this.codeString, this.trace);
    // sails.ohmylog.error(this.trace);

    const body = {
      status: this.status(),
      code: this.code || 0,
      type: this.type || ErrorHandler.INTERNAL,
      errors: []
    };
    const message = typeof this.message == 'string' ? this.message : this.message.message;
    const meta = this.message.meta || {};

    body.message = t(message, meta);
    this.errors.forEach((e) => {
      const m = typeof e.message == 'string' ? e.message : e.message.message;
      const mt = e.message.meta || {};

      body.errors.push({
        fields: e.fields,
        message: t(m, mt)
      });
    });

    return body;
  }
}

ErrorHandler.manage = function(mappings) {
  return function(err) {
    console.log(err);
    const newError = mappings[err.name];

    if (newError) {
      throw newError;
    }

    throw err;
  };
};

// type: Request
// status: 400
// message:
// errors: [{fields: message:}]
ErrorHandler.badRequest = function(errors = []) {
  return new ErrorHandler('badRequest', 'bad_body_sent', 101, ErrorHandler.REQUEST, errors);
};

ErrorHandler.elemsRepeated = function(field) {
  return new ErrorHandler('badRequest', 'bad_body_sent', 106, ErrorHandler.REQUEST, [
    {
      fields: [field],
      message: 'elements_repeated'
    }
  ]);
};

// type: Request,
// status: 404,
// message:
// errors: []
ErrorHandler.notFoundModel = function(model, by = 'plain', codeString = 'notFound') {
  return new ErrorHandler(codeString, 'not_found_' + model, notFoundFrom[by], ErrorHandler.REQUEST);
};

// type: Rules
// status: 409
// message:
// errors: []
ErrorHandler.fault = function(message, code, status = 'conflict') {
  return new ErrorHandler(status, message, code, ErrorHandler.RULES);
};

ErrorHandler.invalidId = function(field) {
  return new ErrorHandler('badRequest', 'params_bad', 1, ErrorHandler.REQUEST, [
    {
      fields: [field],
      message: 'bad_id'
    }
  ]);
};

ErrorHandler.RULES = 'Rules';
ErrorHandler.REQUEST = 'Request';
ErrorHandler.MODEL = 'Validations';
ErrorHandler.AUTH = 'Authorization';
ErrorHandler.SERVER = 'Server';
ErrorHandler.SERVICES = 'Services';
ErrorHandler.INTERNAL = 'Internal';

module.exports = function() {
  return {
    defaults: {
      errorhandler: {
        invalid: 422,
        conflict: 409,
        badRequest: 400,
        forbidden: 403,
        unauthorized: 401,
        unavailableForLegalReasons: 451,
        failedDependency: 424,
        preconditionFailed: 412,
        unsupportedMediaType: 415,
        notImplemented: 501,
        gone: 410,
        tooManyRequests: 429,
        notFound: 404,
        serverError: 500,
        redirect: 307,
        teapot: 418,
        notAcceptable: 406,
        serviceUnavailable: 503,
        badGateway: 502
      }
    },

    initialize: function(cb) {
      global.ErrorHandler = ErrorHandler;
      cb();
    },

    toErrorHandler(err, options = {}) {
      console.log(err);
      if (err instanceof Sequelize.EmptyResultError) {
        return ErrorHandler.notFoundModel('generic');
      }

      if (err instanceof Sequelize.ForeignKeyConstraintError) {
        return ErrorHandler.notFoundModel(options.model || err.fields[0], options.in || 'body', options.code || 'notFound');
      }

      if (err instanceof Sequelize.TimeoutError) {
        sails.ohmylog.error('Database deadlock!!', err);
        return new ErrorHandler('locked', 'db_locked', 708, ErrorHandler.INTERNAL);
      }

      if (err instanceof Sequelize.DatabaseError) {
        sails.ohmylog.error('Database error: ', err.message, err.sql);
        if (err.original.code == 'ER_LOCK_DEADLOCK') {
          return new ErrorHandler('locked', 'optimistic_locking', 112, ErrorHandler.REQUEST);
        }

        return new ErrorHandler('serverError', 'databaseError', 708, ErrorHandler.INTERNAL);
      }

      if (err instanceof Sequelize.UniqueConstraintError) {
        const field = err.errors[0].path || 'unique_violation';

        return new ErrorHandler('conflict', field, 202, ErrorHandler.MODEL);
      }

      if (err instanceof Sequelize.ValidationError) {
        const errors = [];

        err.errors.forEach((e) => {
          if (e.type == 'notNull Violation') {
            errors.push({
              fields: [e.path],
              message: {
                message: 'missing_arguments',
                meta: {path: e.path}
              }
            });
          } else if (e.validatorKey == 'len') {
            if (e.validatorArgs[0] == e.validatorArgs[1]) {
              errors.push({
                fields: [e.path],
                message: {
                  message: 'lenHave {{path}} {{value}}',
                  meta: {
                    path: e.path,
                    value: e.validatorArgs[0]
                  }
                }
              });
            } else if (e.validatorArgs[0] == 0) {
              errors.push({
                fields: [e.path],
                message: {
                  message: 'lenMost {{path}} {{value}}',
                  meta: {
                    path: e.path,
                    value: e.validatorArgs[1]
                  }
                }
              });
            } else if (e.validatorArgs.length < 2) {
              errors.push({
                fields: [e.path],
                message: {
                  message: 'lenUp {{path}} {{value}}',
                  meta: {
                    path: e.path,
                    value: e.validatorArgs[0]
                  }
                }
              });
            } else {
              errors.push({
                fields: [e.path],
                message: {
                  message: 'lenBtw {{path}} {{min}} {{max}}',
                  meta: {
                    path: e.path,
                    min: e.validatorArgs[0],
                    max: e.validatorArgs[1]
                  }
                }
              });
            }
          } else if (e.validatorKey == 'isEmail') {
            errors.push({
              fields: [e.path],
              message: 'badEmail'
            });
          } else if (e.validatorKey == 'is') {
            errors.push({
              fields: [e.path],
              message: {
                message: e.message,
                meta: {
                  path: e.path
                }
              }
            });
          } else if (e.validatorKey == 'isIn') {
            errors.push({
              fields: [e.path],
              message: {
                message: 'isIn {{path}} {{value}}',
                meta: {
                  path: e.path,
                  value: e.validatorArgs[0].join(', ')
                }
              }
            });
          } else if (e.validatorKey == 'min') {
            errors.push({
              fields: [e.path],
              message: {
                message: 'min {{path}} {{value}}',
                meta: {
                  path: e.path,
                  value: e.validatorArgs[0]
                }
              }
            });
          } else if (e.validatorKey == 'max') {
            errors.push({
              fields: [e.path],
              message: {
                message: 'max {{path}} {{value}}',
                meta: {
                  path: e.path,
                  value: e.validatorArgs[0]
                }
              }
            });
          } else {
            sails.ohmylog.error('Cant parse validation: ' + e.validatorKey);
            errors.push({
              fields: [e.path],
              message: 'invalid_field'
            });
          }
        });

        return new ErrorHandler('invalid', 'bad_fields', 201, ErrorHandler.MODEL, errors);
      }

      if (err.name == 'AggregateError') {
        sails.ohmylog.error('Ignoring error: ' + err[1].message);
        return err[0];
      }

      if (err instanceof Sequelize.OptimisticLockError) {
        return new ErrorHandler('conflict', 'optimistic_locking', 112, ErrorHandler.REQUEST);
      }

      sails.ohmylog.error('CANNOT MAP ERROR', err);
      throw new TypeError(err.name + ' unknown');
    }
  };
};
