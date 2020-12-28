/**
 * PetSitter.js
 *
 * @description :: PetSitter model
 */
// const Op = Sequelize.Op;

module.exports = {
  attributes: {
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.TEXT,
    },
    password: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },
    rate: {
      type: Sequelize.DOUBLE,
      defaultValue: 5.0,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    identification: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    validate: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
  },
  associations: () => {
    PetSitter.hasMany(AccessKey, {
      foreignKey: "petsitter",
      onDelete: "cascade",
    });
    PetSitter.hasMany(Service, {
      foreignKey: "petsitter",
      onDelete: "cascade",
    });
    PetSitter.hasMany(Package, {
      foreignKey: "petsitter",
      onDelete: "cascade",
    });
  },

  options: {
    underscored: true,
    hooks: {
      beforeCreate: AuthManager.hashPassword,
      beforeUpdate: AuthManager.hashPassword,
    },
    scopes: {
      withRelations: () => {
        return {
          include: [Service, Package],
        };
      },
    },

    /********* CLASS METHODS *********/
    classMethods: {
      basicAttributes: function () {
        return [
          "id",
          "name",
          "email",
          "last_name",
          "city",
          "phone",
          "rate",
          "description",
          "image",
          "identification",
        ];
      },
    },

    /********* INSTANCE METHODS *********/
    instanceMethods: {
      /*** FORMATS ***/
      formatBasic: function () {
        return _.pick(this, PetSitter.basicAttributes());
      },
    },
  },
};
