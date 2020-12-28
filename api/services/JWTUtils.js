/**
* Utils for generation of JWT or validations
*/
const jwt = require('jsonwebtoken');
const log = sails.hooks.ohmylog.log('services:jwt');

module.exports = {
  decodeJWT: function(token) {
    return new Pact((resolve) => {
      const decoded = jwt.decode(token, {complete: true});

      if (decoded === null) {
        log.error('JWT was not decoded ' + token);
        throw new ErrorHandler('unauthorized', 'invalid_jwt', 301, ErrorHandler.AUTH);
      }

      resolve(decoded);
    });
  },

  verifyJWT: function(token, secret) {
    return new Pact((resolve) => {
      jwt.verify(token, secret);
      resolve();
    })
      .catch(function(err) {
        log.error('Couldn\'t verify JWT with secret', err.message);
        throw new ErrorHandler('unauthorized', 'invalid_jwt', 301, ErrorHandler.AUTH);
      });
  },

  extractJWT: function(req) {
    return new Pact((resolve) => {
      const authorization = req.headers.authorization;
      const re = /(\S+)\s+(\S+)/;

      // without header or something weird in it
      if (!authorization || typeof authorization !== 'string') {
        throw new ErrorHandler('unauthorized', 'missing_header', 304, ErrorHandler.AUTH);
      }

      const authParams = authorization.match(re);

      if (!authParams) { // no match for required authorization
        log.error('Authorization header isn\'t valid.');
        log.error(authorization);
        throw new ErrorHandler('unauthorized', 'missing_header', 304, ErrorHandler.AUTH);
      }

      const validAuthType = authParams[1] === 'JWT';

      if (validAuthType) {
        return resolve(authParams[2]);
      }

      log.error('Included authorization header, but has invalid type');
        throw new ErrorHandler('unauthorized', 'missing_header', 304, ErrorHandler.AUTH);
    });
  },

  validateIatJWT: function(payload) {
    return new Pact((resolve) => {
      if (!payload.iat) {
        log.error('No iat found in JWT');
        throw new ErrorHandler('unauthorized', 'invalid_jwt', 301, ErrorHandler.AUTH);
      }
      const now = moment();
      const iatWithWindow = moment(payload.iat * 1000).add(sails.config.timing.iatExpiration, 'seconds');
      const isInTheTimeWindow = iatWithWindow > now;

      log.debug('iat:' + payload.iat);
      log.debug('iatWithWindow:' + iatWithWindow.format());
      log.debug('now:' + now.format() + '   seconds:' + now.valueOf() / 1000);
      if (!isInTheTimeWindow) {
        log.error('JWT iat expired iat:' + payload.iat);
        throw new ErrorHandler('unauthorized', 'invalid_jwt', 301, ErrorHandler.AUTH);
      }
      const isTooBig = iatWithWindow > now.add('1', 'hours');

      if (isTooBig) {
        log.error('JWT iat is too big ' + payload.iat);
        throw new ErrorHandler('unauthorized', 'invalid_jwt', 301, ErrorHandler.AUTH);
      }
      return resolve(null);
    });
  },

  generateFromValues: function(values) {
    const payload = {
      sub: values.subject,
      type: values.type,
      device_uuid: values.device_uuid,
      type: values.type
    };

    values.device_uuid === null
      ? payload.recovery = true
      : payload.device_uuid = values.device_uuid;

    return jwt.sign(payload, values.secret);
  }


};
