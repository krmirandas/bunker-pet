/**
 * PetSitterController.js
 *
 * @description :: Server-side logic for managing PetSitter
 */
const fs = require("fs");
const path = require("path");
const mimetypes = ["image/png", "image/jpg"];
const validateExt = function (mime) {
  return validateExt.includes(mime);
};

module.exports = {
  create: function (req, res) {
    let petSitter;
    const samePasswords = req.body.password === req.body.password_confirmation;

    if (!samePasswords) {
      throw new ErrorHandler(
        "invalid",
        "passwordMissmatch",
        111,
        ErrorHandler.REQUEST
      );
    }

    return PetSitter.create(_.omit(req.body, ["password_confirmation"]))
      .then((petSitterrCreated) => {
        console.log(req.files);
        if (req.files && req.files.image) {
          const dir = `${sails.config.public_assets}/petsitter/${petSitterrCreated.id}`;
          const fileIdentification = `${dir}/identification.png`;
          const fileImage = `${dir}/profile.png`;
          if (!validateExt) {
            console.log("Error");
          }
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
              recursive: true,
            });
          }
          fs.writeFileSync(fileIdentification, req.files.identification.data);
          fs.writeFileSync(fileImage, req.files.image.data);
          petSitterrCreated.identification = `${sails.config.public_petsitter}${petSitterrCreated.id}identification.png`;
          petSitterrCreated.image = `${sails.config.public_petsitter}${petSitterrCreated.id}/profile.png`;
          petSitterrCreated.save();
        }
        return petSitterrCreated.formatBasic();
      })
      .then(res.created)
      .catch(res.negotiate);
  },

  update: function (req, res) {
    const petSitterToUpdate = req.authorization.petsitter;

    return petSitterToUpdate
      .update(
        _.pick(req.body, ["name", "last_name", "phone", "gender", "email"])
      )
      .then((updatedPetSitter) => {
        return updatedPetSitter;
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  /********* AUTHORIZATION *********/
  login: function (req, res) {
    let petSitter;
    let newAccessKey;

    return AuthManager.validateLoginData(
      req.body.email,
      req.body.password,
      PetSitter
    )
      .then((foundPetSitter) => {
        petSitter = foundPetSitter;
        return AuthManager.doLogin(petSitter, req.body.device_uuid);
      })
      .then((accessKey) => {
        newAccessKey = accessKey;
        return JWTUtils.generateFromValues({
          subject: accessKey.subject,
          secret: accessKey.secret,
          type: "petsitter",
          device_uuid: req.body.device_uuid,
        });
      })
      .then((access_token) => {
        return {
          petsitter: petSitter.formatBasic(),
          access_key: newAccessKey.formatBasic(),
          access_token: access_token,
        };
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  logout: function (req, res) {
    return req.authorization.accessKey
      .destroy()
      .then(() => {
        res.noContent();
      })
      .catch(res.negotiate);
  },

  get: function (req, res) {
    return PetSitter.findOne({
      where: {
        id: req.authorization.petsitter.id,
      },
    })
      .then((petsitter) => {
        return petsitter.formatBasic();
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  getall: function (req, res) {
    return PetSitter.findAll({})
      .map((petsitter) => {
        return petsitter.formatBasic();
      })
      .then((petsitters) => {
        return {
          petsitters: petsitters,
        };
      })
      .then(res.ok)
      .catch(res.negotiate);
  },

  getInfo: function (req, res) {
    let response = {};
    let clone;
    return PetSitter.scope({
      method: ["withRelations"],
    })
      .findOne({
        where: {
          id: req.params.id,
        },
      })
      .then((petsitter) => {
        clone = petsitter;
        return petsitter.formatBasic();
      })
      .then((formatBasic) => {
        response = formatBasic;
        return Pact.map(clone.Services || [], (service) => {
          return service.formatBasic();
        });
      })
      .then((services) => {
        response.services = services;
        return Pact.map(clone.Packages || [], (package) => {
          return package.formatBasic();
        });
      })
      .then((packages) => {
        response.packages = packages;
        return response;
      })
      .then(res.ok)
      .catch(res.negotiate);
  },
};
