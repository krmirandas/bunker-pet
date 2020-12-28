/**
 * CustomerController.js
 *
 * @description :: Server-side logic for managing Customers
 */
const fs = require('fs');
const path = require('path');
const mimetypes = ['image/png', 'image/jpg'];
const validateExt = function(mime) {
  return validateExt.includes(mime);
};

module.exports = {
  create: function(req, res) {
    let customer;
    const samePasswords = req.body.password === req.body.password_confirmation;

    if (!samePasswords) {
      throw new ErrorHandler('invalid', 'passwordMissmatch', 111, ErrorHandler.REQUEST);
    }

    return Customer.create(_.omit(req.body, ['password_confirmation']))
      .then((customerCreated) => {
        if (req.files && req.files.image) {
          const dir = `${sails.config.public_assets}/customer/${customerCreated.id}`
          console.log(dir)
          const fileName = `${dir}/profile.png`
          if (!validateExt) {
            console.log("Error")
          }
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
              recursive: true
            });
          }
          fs.writeFileSync(fileName, req.files.image.data);
          customerCreated.image = `profile.png`
          customerCreated.save();
        }
        return customerCreated.formatBasic();
      })
      .then(res.created)
      .catch(res.negotiate);
  },

  update: function(req, res) {
    const customerToUpdate = req.authorization.customer;

    return customerToUpdate.update(_.pick(req.body, ['name', 'last_name', 'phone', 'gender', 'email']))
      .then((customerUpdated) => {
        return customerUpdated;
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  /********* AUTHORIZATION *********/
  login: function(req, res) {
    let customer;
    let newAccessKey;

    return AuthManager.validateLoginData(req.body.email, req.body.password, Customer)
      .then((customerFound) => {
        customer = customerFound;
        return AuthManager.doLogin(customer, req.body.device_uuid);
      })
      .then((accessKey) => {
        newAccessKey = accessKey;
        return JWTUtils.generateFromValues({
          subject: accessKey.subject,
          secret: accessKey.secret,
          type: 'customer',
          device_uuid: req.body.device_uuid
        });
      })
      .then((access_token) => {
        return {
          customer: customer.formatBasic(),
          access_key: newAccessKey.formatBasic(),
          access_token: access_token
        };
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  logout: function(req, res) {
    return req.authorization.accessKey.destroy()
      .then(() => {
        res.noContent();
      })
      .catch(res.negotiate);
  },

  get: function(req, res) {
    return Customer.find({
        where: {
          id: req.authorization.customer.id
        }
      })
      .then(customer => {
        return customer.formatBasic()
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  getImage: function(req, res) {
    return Customer.findOne({
        where: {
          id: req.authorization.customer.id
        }
      })
      .then(customer => {
        const dir = `${sails.config.public_assets}/customer/${customer.id}`;
        const file_name = `${dir}/${customer.image}`;
        const exists = fs.existsSync(file_name);
        if (exists) {
          res.sendFile(path.resolve(file_name));
        }
      })
  }
};
