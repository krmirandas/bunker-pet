/**
 * Id params validator
 *
 * @module      :: Policy
 * @description :: Looks for all params in path and their corresponding model
 */
const log = sails.hooks.ohmylog.log('policies:ids');
const Promise = require('bluebird');

module.exports = function(req, res, next) {
  if (!req.options.id) {
    log.silly('Skipping id validation');
    return next();
  }

  const validId = /^[1-9]+\d*$/;

  return new Promise((resolve, reject) => {
    const justId = typeof req.options.id == 'boolean';
    const ids = [];

    if (typeof req.options.id == 'string') {
      ids.push({
        model: req.options.id.toLowerCase(),
        as: req.options.id,
        by: 'id',
        validation: validId
      });
    }

    if (typeof req.options.id == 'object') {
      for (key in req.options.id) {
        const value = req.options.id[key];

        if (value instanceof Array) {
          ids.push({
            model: value[0].toLowerCase(),
            as: value[1] || value[0],
            by: key,
            validation: value[2] || justId
          });
        } else {
          ids.push({
            model: value.toLowerCase(),
            as: value,
            by: key,
            validation: validId
          });
        }
      }
    }

    if (justId && !validId.test(req.params.id)) {
      return reject(ErrorHandler.invalidId('id'));
    }

    return resolve(ids);
  })
    .map((param) => {
      const value = req.params[param.by];
      const where = {};

      log.silly(`Validating ${param.model} with ${param.by} ${value}`);

      if (!param.validation.test(value)) {
        throw ErrorHandler.invalidId(param.by);
      }

      where[param.by] = value;

      return sails.models[param.model].find({
        where: where,
        rejectOnEmpty: new ErrorHandler.notFoundModel(param.model, 'params')
      })
        .then((model) => {
          req.options[param.as] = model;
        });
    })
    .then(() => {
      next();
    })
    .catch(res.negotiate);
};
