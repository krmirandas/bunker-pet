/**
 * AccessKey.js
 *
 * @description :: Represents the authentication status of an user
 */
// const randToken = require('rand-token');
const log = sails.hooks.ohmylog.log('models:accessKey');
const Op = Sequelize.Op;
const moment = require('moment');

module.exports = {
  attributes: {
    subject: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    secret: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    device_uuid: {
      type: Sequelize.STRING(36)
    },
    expires_at: {
      type: Sequelize.DATE,
      get() {
        const expiresAt = this.getDataValue('expires_at');

        return expiresAt ? expiresAt.getTime() : null;
      }
    }
  },
  associations: () => {
    AccessKey.belongsTo(PetSitter, {
      foreignKey: 'petsitter'
    });
    AccessKey.belongsTo(Customer, {
      foreignKey: 'customer'
    });
    AccessKey.belongsTo(Admin, {
      foreignKey: 'admin'
    });
  },
  options: {
    underscored: true,
    indexes: [{
      name: 'device_uuid_per_user',
      fields: ['device_uuid', 'petsitter', 'customer', 'admin'],
      unique: true
    }],
    hooks: {
      beforeValidate: function(values) {
        const hasOwner = values.petsitter || values.customer || values.admin;

        // if (!hasOwner) {
        //   log.error('Creating access key without owner');
        //   throw sails.hooks.errorhandler.create('serverError', 'serverError');
        // }
      },
      beforeCreate: function(instance) {
        if (!instance.expires_at) {
          instance.expires_at = moment().add(sails.config.timing.loginExpiration, 'seconds');
        }
      }
    },
    /********* CLASS METHODS *********/
    classMethods: {
      getFromPayload: function(payload) {
        return new Pact((resolve) => {
          if (!payload.sub) {
            log.error('Payload without subject');
            log.error(payload);
            throw new ErrorHandler('unauthorized', 'invalid_jwt', 301, ErrorHandler.AUTH)
          }
          const hasValidType = payload.type && _.includes(['petsitter', 'customer', 'admin'], payload.type);

          if (!hasValidType) {
            log.error('Payload without valid type.');
            log.error(payload);
            throw new ErrorHandler('unauthorized', 'invalid_jwt', 301, ErrorHandler.AUTH)
          }
          const query = {
            where: {
              subject: payload.sub,
              device_uuid: payload.device_uuid ? payload.device_uuid : null
            },
            rejectOnEmpty: new ErrorHandler('unauthorized', 'invalid_jwt', 301, ErrorHandler.AUTH)
          };

          if (payload.type == 'petsitter') {
            query.include = [PetSitter];
          } else if (payload.type == 'customer') {
            query.where.customer = {
              [Op.ne]: null
            };
            query.include = [Customer];
          } else {
            query.where.admin = {
              [Op.ne]: null
            };
            query.include = [Admin];
          }
          return resolve(AccessKey.findOne(query));
        });
      }
    },

    /********* INSTANCE METHODS *********/
    instanceMethods: {

      /*** FORMATS ***/
      formatBasic: function() {
        return _.pick(this, ['subject', 'secret', 'expires_at']);
      },

      /*** SYNC ***/
      isForRecovery: function() {
        return this.device_uuid === null;
      },

      hasExpired: function() {
        return this.expires_at < moment().valueOf();
      },

      getUserModelName: function() {
        if (this.petsitter) {
          return 'petsitter'
        } else if (this.customer) {
          return 'customer'
        } else {
          return 'admin'
        }
      },

      //Must have PetSitter and Customer Populated
      getUser: function() {
        if (this.PetSitter) {
          return this.PetSitter;
        } else if (this.Admin) {
          return this.Admin;
        }
        return this.Customer;

      }

    }
  }
};
