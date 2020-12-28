/**
* Utils functions to manage model instances
*/
const retry = require('bluebird-retry');

module.exports = {

  getModelName: function(modelInstance, plural = false) {
    const modelName = modelInstance._modelOptions.name[plural ? 'plural' : 'singular'];

    return modelName;
  },
  getModelNameLower: function(modelInstance, plural) {
    return sails.services.modelutils.getModelName(modelInstance, plural).toLowerCase();
  },
  getModelNameFirstLower: function(modelInstance, plural) {
    const name = sails.services.modelutils.getModelName(modelInstance, plural);

    if (name == name.toUpperCase()) {
      return name.toLowerCase();
    }

    return name[0].toLowerCase() + name.slice(1);
  },

  deleteAll: function() {

    return Pact.map(_.values(sails.models), (model) => {
      return retry(() => {
        return model.destroy({where: {}, force: true});
      });
    });
  }

};
