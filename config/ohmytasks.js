/* eslint-disable global-require */
/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */
const chalk = require('chalk');

module.exports.ohmytasks = {
  onLift: function() {

    sails.ohmylog.info('‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾');
    sails.ohmylog.info('          ' + new Date() + '\n');
    sails.ohmylog.info('   Environment : ' + sails.config.environment);
    sails.ohmylog.info(`   Database    : ${sails.config.connections[sails.config.environment].database}}`);
    sails.ohmylog.info('   Port        : ' + sails.config.port);
    sails.ohmylog.info('   Node        : ' + process.version);
    sails.ohmylog.info('   PID         : ' + process.pid);
    sails.ohmylog.info(`   Logging     : ${sails.config.ohmylog.console.level}/${sails.config.ohmylog.file.level}`);
    sails.ohmylog.info(`   Models      : ${sails.config.models.migrate}`);
    sails.ohmylog.info('_________________________________________________________\n\n');
  },


  before: function(sails, cb) {

    sails.ohmylog.info('---------------- Loading config ----------------'.cyan);
    return cb();
  },

  after: function(sails, cb) {

    sails.ohmylog.info('--------------------- Done ---------------------\n'.cyan);
    return cb();
  },

  dirname: 'ohmytasks',
  toDo: [
    {
      tasks: ['globals', 'seed'],
      order: true
    }
  ]
};
