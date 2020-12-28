/**
 * 500 (Server Error) Response
 */

const log = sails.hooks.ohmylog.log('responses:serverError');

module.exports = function(error) {
  const res = this.res;

  log.error('UNEXPECTED ERROR', error.message);

  return res.negotiate(error);
};
