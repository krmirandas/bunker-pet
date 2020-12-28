/**
 * PackageController.js
 *
 * @description :: Server-side logic for managing Packages
 */

module.exports = {
  create: function (req, res) {
    req.body.petsitter = req.authorization.petsitter.id;
    return Package.create(req.body)
      .then((createdPackage) => {
        return createdPackage.formatBasic();
      })
      .then(res.created)
      .catch(res.negotiate);
  },

  update: function (req, res) {
    return Package.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((packageToUpdate) => {
        return packageToUpdate
          .update(_.pick(req.body))
          .then((updatedPackage) => {
            return updatedPackage;
          });
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  getall: function (req, res) {
    return Package.findAll({
      where: {
        petsitter: req.authorization.petsitter.id,
      },
    })
      .map((package) => {
        return package.formatBasic();
      })
      .then((packages) => {
        return {
          packages,
        };
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  delete: function (req, res) {
    return Package.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((package) => {
        return package.destroy();
      })
      .then(res.noContent)
      .catch(res.negotiate);
  },
};
