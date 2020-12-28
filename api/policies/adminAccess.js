/**
 * adminAccess
 *
 * @module      :: Policy
 * @description :: Verifies the access was made by an Admin
 * @throws  :: 401 if no accesskey in header
 *                 | not accesskey for recovery
 *             410 AccesskeyExpired
 */

var log = sails.hooks.ohmylog.log('policie:adminAccess');

module.exports = function(req, res, next) {

  return new Pact((resolve) => {

      if (!req.authorization.admin) {
        log.error('Request was not made by admin');
        throw new ErrorHandler('forbidden', 'without_permissions', 309, ErrorHandler.AUTH);
      }
      return resolve();
    })
    .then(next)
    .catch(res.negotiate);
};
