/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */
module.exports.routes = {
  /*** CUSTOMER CONTROLLER ***/
  'post /customers': {
    controller: 'Customer',
    action: 'create',
    body: 'newCustomers'
  },
  'post /customers/session': {
    controller: 'Customer',
    action: 'login',
    body: 'login'
  },
  'delete /customers/session': {
    controller: 'Customer',
    action: 'logout'
  },
  'get /customers/image': {
    controller: 'Customer',
    action: 'getImage'
  },




  /*** ADMIN CONTROLLER ***/
  'post /admins/session': {
    controller: 'AdminController',
    action: 'login',
    body: 'login'
  },
  'delete /admins/session': {
    controller: 'AdminController',
    action: 'logout'
  },


  /*** PET SITTER CONTROLLER ***/
  'post /pet_sitters': {
    controller: 'PetSitter',
    action: 'create'
  },
  'post /pet_sitter/session': {
    controller: 'PetSitter',
    action: 'login',
    body: 'login'
  },
  'delete /pet_sitter/session': {
    controller: 'PetSitter',
    action: 'logout'
  },
  'get /pet_sitter/perfile': {
    controller: 'PetSitter',
    action: 'get'
  },

  'get /all/pet_sitters': {
    controller: 'PetSitter',
    action: 'getall'
  },

  'get /pet_sitter/:id': {
    controller: 'PetSitter',
    action: 'getInfo'
  },

  /** SERVICES ***/

  'post /service': {
    controller: 'Service',
    action: 'create'
  },
  'delete /service/:id': {
    controller: 'Service',
    action: 'delete'
  },
  'get /services': {
    controller: 'Service',
    action: 'getall'
  },
  'put /service/:id': {
    controller: 'Service',
    action: 'update'
  },

  /** PACKAGES ***/

  'post /package': {
    controller: 'Package',
    action: 'create'
  },
  'delete /package/:id': {
    controller: 'Package',
    action: 'delete'
  },
  'get /packages': {
    controller: 'Package',
    action: 'getall'
  },
  'put /package/:id': {
    controller: 'Package',
    action: 'update'
  },

  /** PETS ***/

  'post /pet': {
    controller: 'Pet',
    action: 'create'
  },
  'get /pets': {
    controller: 'Pet',
    action: 'getall'
  },
  'put /pet/:id': {
    controller: 'Pet',
    action: 'update'
  },
  'delete /pet/:id': {
    controller: 'Pet',
    action: 'delete'
  },

  'get /assets/*': {
    controller: 'Image',
    action: 'download'
  }

};