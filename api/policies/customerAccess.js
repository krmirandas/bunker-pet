/**
 * customerAccess
 *
 * @module      :: Policy
 * @description :: Verifies the access was made by a Customer
 * @throws  :: 401 if no accesskey in header
 *                 | not accesskey for recovery
 *             403 No reset expected
 */

var log = sails.hooks.ohmylog.log('policie:customerAccess');

module.exports = function(req, res, next) {

  return new Pact((resolve) => {
      if (!req.authorization.customer) {
        log.error('Request was not made by customer');
        throw new ErrorHandler('forbidden', 'without_permissions', 309, ErrorHandler.AUTH);
      }
      return resolve();
    })
    .then(next)
    .catch(res.negotiate);

};
