/**
 * sessionAccess
 *
 * @module      :: Policy
 * @description :: Verifies access key referes to a session.
 * @throws  :: 401 if no header found
 *                 | header didnt match pattern
 *                 | header isnt JWT
 *                 | header undecodable
 *
 */

var log = sails.hooks.ohmylog.log('policies:sessionAccess');

module.exports = function(req, res, next) {

  return new Promise((resolve) => {
    if (!req.authorization.accessKey) {
      log.error('No AccessKey in request');
      throw new ErrorHandler('unauthorized', 'invalid_jwt', 301, ErrorHandler.AUTH);
    }
    if (req.authorization.accessKey.isForRecovery()) {
      log.error('AccesKey is only valid for recovery');
      throw new ErrorHandler('unauthorized', 'invalid_jwt', 301, ErrorHandler.AUTH);
    }
    return resolve();
  })
  .then(next)
  .catch(res.negotiate);
};
