/**
 * Negotiate
 *
 * This response is called with errors thrown in controllers
 *
 * Will try to convert error to one known (via hooks.errorhandler.toErrorHandler mappings)
 * if not, will send 500 (Server Error)
 */
const log = sails.hooks.ohmylog.log('responses:negotiate');
const Promise = require('bluebird');

module.exports = function(error) {
  const res = this.res;
  const req = this.req;

  new Promise((resolve) => {
    if (error.name == 'ErrorHandler') {
      return resolve(error);
    }

    return resolve(sails.hooks.errorhandler.toErrorHandler(error, req.options.errorhandler));
  })
    .catch(() => {
      return new ErrorHandler('serverError', 'unexpected_error', 50, ErrorHandler.SERVER);
    })
    .then((err) => {
      const body = err.respond(sails.__);

      log.error(`Sending ${body.status} (${body.code}):`, body.message, body.errors);
      res.status(body.status);
      return res.json({error: body});
    });
};
