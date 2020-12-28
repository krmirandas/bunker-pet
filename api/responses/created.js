/**
 * 201 (Created) Response
 */
const log = sails.hooks.ohmylog.log('responses:created');

module.exports = function(response) {
  const res = this.res;
  let json = response || {};

  res.status(201);

  if (response instanceof Sequelize.Model) {
    json = response.formatBasic();
  }

  log.info('Response:', json);
  return res.json(json);
};
