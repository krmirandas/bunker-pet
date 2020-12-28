/**
 * 200 (OK) Response
 */
const log = sails.hooks.ohmylog.log('responses:ok');

module.exports = function(response) {
  const res = this.res;
  let json = response || {};

  res.status(200);

  if (response instanceof Sequelize.Model) {
    json = response.formatBasic();
  }

  if (!(json instanceof Array) && this.req.path != '/status') {
    log.info('Response:', json);
  }

  return res.json(json);
};
