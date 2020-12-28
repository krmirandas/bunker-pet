/**
 * 204 (No Content) Response
 */

module.exports = function() {
  const res = this.res;

  res.status(204);
  return res.json({});
};
