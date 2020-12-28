/**
 * Customer.js
 *
 * @description :: Customer model
 */
const moment = require('moment');

module.exports = {
  attributes: {
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    gender: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['male', 'female', 'other'],
    },
    image: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    password_recovery_at: {
      type: Sequelize.DATE,
      get() {
        const recoveryAt = this.getDataValue('password_recovery_at');

        return recoveryAt ? recoveryAt.getTime() : null;
      }
    }
  },

  associations: () => {
    Customer.hasMany(AccessKey, {
      foreignKey: 'customer',
      onDelete: 'cascade'
    });
    Customer.hasMany(Pet, {
      foreignKey: 'customer',
      onDelete: 'cascade'
    });
  },

  options: {
    underscored: true,
    hooks: {
      beforeCreate: AuthManager.hashPassword,
      beforeUpdate: AuthManager.hashPassword
    },
    /********* CLASS METHODS *********/
    classMethods: {
      basicAttributes: function() {
        return ['id', 'email', 'name', 'last_name', 'phone', 'gender'];
      }
    },

    /********* INSTANCE METHODS *********/
    instanceMethods: {
      /*** FORMATS ***/
      formatBasic: function() {
        return _.pick(this, Customer.basicAttributes());
      }
    }
  }
};
