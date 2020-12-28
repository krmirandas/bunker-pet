/**
 * Pet.js
 *
 * @description :: Pet model
 */
const moment = require('moment');

module.exports = {
  attributes: {
    name: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    // last_name: {
    //   type: Sequelize.STRING(30),
    //   allowNull: true
    // },
    gender: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ["Macho", "Hembra"],
    },
    // birth: {
    //   type: Sequelize.DATE,
    //   allowNull: false,
    //   validate: {
    //     isCorrectAge(value) {
    //       if (moment(value) > moment().subtract(18, 'years')) {
    //         throw new Error('invalidAge');
    //       }
    //     }
    //   },
    //   get() {
    //     const birth = this.getDataValue('birth');
    //
    //     return moment(birth).utc().format('YYYY-MM-DD');
    //   }
    // },
    personality: {
      type: Sequelize.TEXT
    },
    size: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    weight: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    // picture: {
    //   type: Sequelize.TEXT,
    //   allowNull: false
    // },
    // vaccine: {
    //   type: Sequelize.JSONB(),
    //   allowNull: true
    // }
  },

  associations: () => {
    Pet.belongsTo(Customer, {
      foreignKey: 'customer',
      onDelete: 'cascade'
    })
  },

  options: {
    underscored: true,
    /********* CLASS METHODS *********/
    classMethods: {
      basicAttributes: function () {
        return [
          "id",
          "weight",
          "size",
          "gender",
          "personality",
          "name",
          "age",
        ];
      }
    },

    /********* INSTANCE METHODS *********/
    instanceMethods: {
      /*** FORMATS ***/
      formatBasic: function () {
        return _.pick(this, Pet.basicAttributes());
      }
    }
  }
};