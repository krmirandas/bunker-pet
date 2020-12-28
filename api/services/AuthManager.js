/**
 * AuthManager
 *
 * @module      :: Service
 * @description :: Functions for general authentication of
                   AccessKey users(admin, customer)
                   Models most have the following attributes:
                   password, password_recovery_at, name, email.
 */
// const log = sails.hooks.ohmylog.log('services:auth');
const randToken = require('rand-token');
const crypto = require('crypto-js/sha3');
const log = sails.hooks.ohmylog.log('services:authManager');

function getModelName(user) {
  return sails.services.modelutils.getModelNameLower(user);
}

const Pact = require('bluebird');

module.exports = {

  hashPassword: function(user) {
    if (!user.changed('password')) {
      return Pact.resolve();
    }
    return new Pact((resolve) => {
      const passwordHash = crypto(user.password).toString();

      user.password = passwordHash;
      resolve();
    });
  },

  validatePassword: function(user, password) {
    const passwordHash = crypto(password).toString();

    if (user.password !== passwordHash) {
      throw new ErrorHandler('unauthorized', 'invalid_login', 306, ErrorHandler.AUTH);
    }
    return user;
  },

  validateLoginData: function(email, password, model) {
    return model.findOne({
      where: {
        email: email
      },
      rejectOnEmpty: new ErrorHandler('unauthorized', 'invalid_login', 306, ErrorHandler.AUTH)
    })
      .then((user) => {
        if (user.deactivated_at) {
          log.error('Admin deactivated');
          throw sails.hooks.errorhandler.create('forbidden', 'withoutPermitions');
        }
        return AuthManager.validatePassword(user, password);
      });
  },

  doLogin: function(user, uuid) {
    let accessKey;
    return user.getAccessKeys({ where: { device_uuid: uuid }, limit: 1 })
      .then(([accessKeyWithSameUuid]) => {
        console.log(accessKeyWithSameUuid)
        if (accessKeyWithSameUuid) {

          return accessKeyWithSameUuid.update({
            secret: randToken.generate(20),
            expires_at: moment().add(sails.config.timing.loginExpiration, 'seconds')
          });
        }
        const creationData = {
          subject: user.email,
          secret: randToken.generate(20),
          device_uuid: uuid
        };
        creationData[getModelName(user)] = user.id;
        return AccessKey.create(creationData);

      })
      .then((newAccessKey) => {
        accessKey = newAccessKey;
        return sails.services.authmanager.removePasswordRecovery(user);
      })
      .then(() => {
        return accessKey;
      });
  },


  removePasswordRecoveryAccessKey: function(user) {
    const query = {
      where: {
        subject: user.email,
        device_uuid: null
      }
    };

    query[getModelName(user)] = user.id;
    return AccessKey.findOne(query)
      .then((accessKeyForRecovery) => {
        if (accessKeyForRecovery) {
          log.debug('Destroing old accessKey for recvovery');
          return accessKeyForRecovery.destroy({paranoid: false});
        }
        return null;
      });
  },

  removePasswordRecovery: function(user) {
    return Pact.all([
      user.update({
        password_recovery_at: null
      }),
      AuthManager.removePasswordRecoveryAccessKey(user)
    ]);
  },

  requestPasswordRecovery: function(user) {
    return user.update({password_recovery_at: moment()})
      .then(() => {
        return AuthManager.removePasswordRecoveryAccessKey(user);
      })
      .then(() => {
        const creationData = {
          subject: user.email,
          secret: randToken.generate(20),
          device_uuid: null,
          expires_at: moment().add(sails.config.timing.passwordRecoveryExpiration, 'seconds')
        };

        creationData[getModelName(user)] = user.id;
        return AccessKey.create(creationData);
      });

  },

  removeAllAccessKeys: function(user, excludedUuid = []) {
    const query = {
      where: {
        device_uuid: {
          [Sequelize.Op.notIn]: excludedUuid
        }
      },
      paranoid: false
    };

    query.where[getModelName(user)] = user.id;

    return AccessKey.destroy(query);
  },

  changePassword: function(user, newPassword, excludedUuid) {

    return user.update({password: newPassword, password_recovery_at: null})
      .then((userUpdated) => {
        return AuthManager.removeAllAccessKeys(userUpdated, excludedUuid);
      });
  },




};
