'use strict';

module.exports = {

  /*** GET AUTH INSTANCES ***/
  getAuthAdmin: function() {
    return Admin.findById(4001, {include: [AccessKey]});
  },
  getAuthCustomer: function() {
    return Customer.findById(4001, {include: [AccessKey]});
  },

  /*** GENERATE AUTH  ***/
  generateJWTTestForAdmin: function() {
    return sails.services.jwtutils.generateFromValues({
      subject: 'authseed@email.com',
      secret: 'GyK2UwEUgAsLYqH25Lw2',
      device_uuid: 'ea90fb89-134b-4b92-846e-8154b9493c82',
      type: 'admin'
    });
  },
  generateJWTTestForCustomer: function() {
    return sails.services.jwtutils.generateFromValues({
      subject: 'authseed@email.com',
      secret: '8927askdjasdnq2jKJSS',
      device_uuid: 'ea90fb89-134b-4b92-846e-8154b9493c82',
      type: 'customer'
    });
  },
  generateJWTWithValues: function(type, subject, secret, device_uuid) {
    const passingAccessKey = typeof subject == 'object';
    let values;

    if (passingAccessKey) {
      values = subject;
      values.type = type;
    } else {
      values = {
        subject: subject,
        secret: secret,
        device_uuid: device_uuid,
        type: type
      };
    }
    return sails.services.jwtutils.generateFromValues(values);
  }


};
