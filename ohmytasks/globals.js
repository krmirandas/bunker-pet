const Pact = require('bluebird');
const moment = require('moment');
const _ = require('lodash');
const env_database = sails.config.environment || 'test';

module.exports = function(sails, next) {

  sails.ohmylog.info('Setting global variables');
  global.moment = moment;
  global.Pact = Pact;
  global.sequelize = SequelizeConnections[env_database];
  global._ = _;
  global.env_database = env_database;
  global.errorhandler = new ErrorHandler();

  return next(null, sails);
};
