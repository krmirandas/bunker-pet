const sequelize_fixtures = require('sequelize-fixtures');

module.exports = function(sails, next) {

  if (sails.config.models.migrate != 'drop' || sails.config.SKIP_SEED) {
    return next(null, sails);
  }
  sails.ohmylog.info('Starting seed for dropped DB');
  sequelize_fixtures.loadFixtures(sails.config.seed[sails.config.environment], sails.models).asCallback(
    function(err) {
      if (err) {
        sails.ohmylog.error('Error during seed for ' + sails.config.environment);
      } else {
        sails.ohmylog.info('  ✓  Seed completed');
      }
      return next(err, sails);
    }
  );
  return null;
};
