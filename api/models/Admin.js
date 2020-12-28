/**
 * Admin.js
 *
 * @description :: Admin model
 */
// const Op = Sequelize.Op;

module.exports = {
  attributes: {
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false
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
    Admin.hasMany(AccessKey, {
      foreignKey: 'admin',
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
        return ['id', 'name', 'email', 'last_name', 'phone'];
      }
    },

    /********* INSTANCE METHODS *********/
    instanceMethods: {
      /*** FORMATS ***/
      formatBasic: function() {
        return _.pick(this, Admin.basicAttributes());
      },

      //Most have Brands populated
      formatBasic: function() {
        const admin = this;
        const adminFormated = admin.formatBasic();
        return adminFormated;
      }
    }
  }
};
