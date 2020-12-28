/**
 * Request arguments validations
 *
 * @module      :: Policy
 * @description :: Validates body of request and sets it with clean values
 */
const _ = require('lodash');
const Joi = require('joi');
const Schemas = require('../../config/schemas');
const Promise = require('bluebird');
const log = sails.hooks.ohmylog.log('policies:request');
const _validationOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

module.exports = function(req, res, next) {
  if (req.options.body) {
    const _schema = _.get(Schemas, req.options.body);

    if (_schema) {

      return Joi.validate(req.body, _schema, _validationOptions)
        .then((data) => {
          req.body = data;
          next();
        })
        .catch((err) => {
          const JoiError = {
            error: {
              status: 422,
              code: 201,
              type: "Validations",
              errors: _.map(err.details, ({
                message,
                type,
                context,
                path
              }) => ({
                field: _.head(path),
                message: message.replace(/['"]/g, ''),
                type,
                context
              }))
            }
          };
          res.status(422).json(JoiError);
        })
    }
  }
  next();
};
