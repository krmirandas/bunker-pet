/**
 * AdminController.js
 *
 * @description :: Server-side logic for managing Admins
 */
// const log = sails.hooks.ohmylog.log('controllers:admin')

module.exports = {
  /********* AUTHORIZATION *********/
  login: function(req, res) {
    let admin;

    return AuthManager.validateLoginData(req.body.email, req.body.password, Admin)
    .then((adminFound) => {
        admin = adminFound;
        if (admin.desactivated_at) {
          log.info('User has been desactivated');
          throw new ErrorHandler('forbidden', 'without_permissions', 309, ErrorHandler.AUTH);
        }

        return AuthManager.doLogin(admin, req.body.device_uuid);
      })
      .then((accessKey) => {
        return {
          admin: admin.formatBasic(),
          access_key: accessKey.formatBasic()
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
};
