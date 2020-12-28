/* schemas.js */

const Joi = require('joi');
const personID = Joi.string().guid({version: 'uuidv4'});
const customerRequiredDataSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string(),
    password: Joi.string().min(7).required().strict(),
    password_confirmation: Joi.string().valid(Joi.ref('password')).required().strict(),
    gender: Joi.string().valid(['male', 'female', 'other']).required()
});

const customerOptionalDataSchema = Joi.object().keys({
    email: Joi.string().email().optional(),
    name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    fullname: Joi.string().regex(/^[A-Z]+ [A-Z]+$/i).uppercase(),
    phone: Joi.string(),
    gender: Joi.string().valid(['male', 'female', 'other']).optional()
});

const loginDataSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required().strict(),
  device_uuid: Joi.string().required().strict()
});

const petSchema = Joi.object().keys({
  weight: Joi.number().precision(2),
  size: Joi.number().precision(2),
  //picture: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  //vaccine: Joi.object({}).optional(),
  gender: Joi.string().valid(['male', 'female']).optional(),
  personality: Joi.string().optional(),
  //birth: Joi.string().isoDate(),
  name: Joi.string().required(),
  //last_name: Joi.string().optional(),
});

// export the schemas
module.exports = {
    'newCustomers': customerRequiredDataSchema,
    'login': loginDataSchema,
    'newPet': petSchema
};
