/**
 * PetController.js
 *
 * @description :: Server-side logic for managing Pets
 */

module.exports = {
  create: function(req, res) {
    req.body.petsitter = req.authorization.petsitter.id;
    return Service.create(req.body)
      .then((createdService) => {
        return createdService.formatBasic();
      })
      .then(res.created)
      .catch(res.negotiate);
  },

  update: function(req, res) {
    return Service.findOne({
        where: {
          id: req.params.id
        }
      })
      .then((serviceToUpdate) => {
        return serviceToUpdate.update(_.pick(req.body))
          .then((updatedService) => {
            return updatedService;
          })
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  getall: function(req, res) {
    return Service.findAll({
        where: {
          petsitter: req.authorization.petsitter.id
        }
      })
      .map(service => {
        return service.formatBasic()
      })
      .then((services) => {
        return {
          services
        }
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  delete: function(req, res) {
    return Service.findOne({
        where: {
          id: req.params.id
        }
      })
      .then((service) => {
        return service.destroy()
      })
      .then(res.noContent)
      .catch(res.negotiate);
  }
};
