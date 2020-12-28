/**
 * PetController.js
 *
 * @description :: Server-side logic for managing Pets
 */

module.exports = {
  create: function (req, res) {
    req.body.customer = req.authorization.customer.id;
    return Pet.create(req.body)
      .then((petCreated) => {
        return petCreated.formatBasic();
      })
      .then(res.created)
      .catch(res.negotiate);
  },

  update: function (req, res) {
    return Pet.findOne({
        where: {
          id: req.params.id
        }
      })
      .then((petToUpdate) => {
        return petToUpdate.update(_.pick(req.body))
          .then((updatedPet) => {
            return updatedPet;
          })
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  getall: function (req, res) {
    return Pet.findAll({
        where: {
          customer: req.authorization.customer.id
        }
      })
      .map(pet => {
        return pet.formatBasic()
      })
      .then((pets) => {
        return {
          pets: pets
        }
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  delete: function (req, res) {
    return Pet.findOne({
        where: {
          id: req.params.id
        }
      })
      .then((pet) => {
        return pet.destroy()
      })
      .then(res.noContent)
      .catch(res.negotiate);
  }


};