const pick = require('lodash/pickBy');

module.exports = {
  beforeDefinition: function(sails, model) {
    if (!model.options.formatBasic) {
      return;
    }

    if (!model.options.instanceMethods) {
      model.options.instanceMethods = {};
    }

    model.options.instanceMethods.formatBasic = function() {
      const attrs = model.options.formatBasic.concat(['id', 'createdAt', 'updatedAt']);
      // Omit attributes from JSON
      const json = pick(this.toJSON(), (value, key) => {
        return attrs.indexOf(key) !== -1;
      });

      // Format dates
      for (const key in json) {
        const currentValue = json[key];

        if (key.endsWith('At') && currentValue instanceof Date) {
          json[key] = Math.trunc(currentValue.getTime() / 1000);
        } else if (key.endsWith('At') && typeof currentValue === 'number') {
          json[key] = Math.trunc(currentValue / 1000);
        }
      }

      return json;
    };
  }
};
