/**
 * Service.js
 *
 * @description :: Service model
 */
// const Op = Sequelize.Op;
const services = ['Hospedaje', 'Baño', 'Paseo', 'Entrenamiento']
module.exports = {
  attributes: {
    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM,
      values: services
    }
  },
  associations: () => {
    Service.belongsTo(PetSitter, {
      foreignKey: 'petsitter',
      onDelete: 'cascade'
    })
  },

  options: {
    underscored: true,

    /********* CLASS METHODS *********/
    classMethods: {
      basicAttributes: function() {
        return ['id', 'price', 'type'];
      }
    },

    /********* INSTANCE METHODS *********/
    instanceMethods: {
      /*** FORMATS ***/
      formatBasic: function() {
        return _.pick(this, Service.basicAttributes());
      }
    }
  }
};
