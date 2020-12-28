/**
 * jwtAuth
 *
 * @module      :: Policy
 * @description :: Decodes the jwt in the request:
 *                    - Validates authorization header
 *                    - Validates JWT validations
 *                    - Validates JWT iat
 *                    - Finds Asociated Accesskey
 *                    - Validates AccessKey not expired
 * @throws  :: 401 if no header found
 *                 | header didnt match pattern
 *                 | header isnt JWT
 *                 | header undecodable
 *
 * @name    req.authorization.token    : token in header
 * @name    req.authorization.payload  : payload decoded
 * @name    req.authorization.accessKey  : accessKey associated
 * @name    req.authorization.admin  : admin associated
 */

var log = sails.hooks.ohmylog.log('policie:jwtAuth');

module.exports = function(req, res, next) {
  req.authorization = {};
  return JWTUtils.extractJWT(req)
    .then((token) => {
      req.authorization.token = token;
      return JWTUtils.decodeJWT(req.authorization.token);
    })
    .then((decodedJwt) => {
      req.authorization.payload = decodedJwt.payload;
      return JWTUtils.validateIatJWT(req.authorization.payload);
    })
    .then(() => {
      return AccessKey.getFromPayload(req.authorization.payload);
    })
    .then((accessKey) => {
      req.authorization.accessKey = accessKey;
      const userModelName = accessKey.getUserModelName();
      const user = accessKey.getUser();

      req.authorization[userModelName] = user;
      if (accessKey.hasExpired()) {
        log.error('Expired AccessKey');
        throw new ErrorHandler('gone', 'device_already_accepted', 111, ErrorHandler.RULES);
      }
      return JWTUtils.verifyJWT(req.authorization.token, accessKey.secret);
    })
    .then(next)
    .catch(res.negotiate);
};
