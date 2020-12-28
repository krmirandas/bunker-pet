/**
 * Package.js
 *
 * @description :: Package model
 */
// const Op = Sequelize.Op;
module.exports = {
    attributes: {
        price: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        type: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    },
    associations: () => {
        Package.belongsTo(PetSitter, {
            foreignKey: 'petsitter',
            onDelete: 'cascade'
        })
    },

    options: {
        underscored: true,

        /********* CLASS METHODS *********/
        classMethods: {
            basicAttributes: function () {
                return ['id', 'price', 'type'];
            }
        },

        /********* INSTANCE METHODS *********/
        instanceMethods: {
            /*** FORMATS ***/
            formatBasic: function () {
                return _.pick(this, Package.basicAttributes());
            }
        }
    }
};