/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const request = ['request'];
const basePolicies = ['ids'];
const customerPolicies = ['jwt', 'sessionAccess', 'customerAccess'];
const petSitterPolicies = ['jwt', 'sessionAccess', 'petSitterAcess'];
const adminPolicies = basePolicies.concat(['jwt', 'sessionAccess', 'adminAccess']);

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/
  customer: {
    /* Authorization */
    'create': request,
    'login': request,
    'logout': customerPolicies,
    'getimage': customerPolicies,
    'get': customerPolicies
  },

  petsitter: {
    'create': request,
    'login': request,
    'logout': petSitterPolicies,
    'get': petSitterPolicies
  },

  admin: {
    'create': request,
    'login': request,
    'logout': adminPolicies
  },

  service: {
    'create': petSitterPolicies,
    'getall': petSitterPolicies,
    'delete': petSitterPolicies,
    'update': petSitterPolicies
  },

  package: {
    'create': petSitterPolicies,
    'getall': petSitterPolicies,
    'delete': petSitterPolicies,
    'update': petSitterPolicies
  },

  pet: {
    'create': customerPolicies,
    'getall': customerPolicies,
    'update': customerPolicies,
    'delete': customerPolicies
  }

};