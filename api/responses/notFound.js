/**
 * 404 (Not Found) Response
 */
module.exports = function(response) {
  console.log(response)
  return res.negotiate(response);
};
