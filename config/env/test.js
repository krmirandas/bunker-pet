/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system.
 *
 * For more information, check out:
 * https://sailsjs.com/docs/concepts/configuration/the-local-js-file
 */

module.exports = {
  /*
    Conexion a la base de datos que se usará,
    el nombre corresponde al ambiente elegido
  */
  connection: 'test',

  models: {
    connection: 'test',
    migrate: 'drop'
  },

  globals: {
    models: true,
    sails: true
  },

  /**
   * Puerto de la aplicación
   * debe corresponder con el puerto al que apuntará el proxy.
   * En este puerto iniciará la aplicación.
   */

  port: 1441,


  security: {

    csrf: false,
    cors: {
      allRoutes: true,
      allowAnyOriginWithCredentialsUnsafe: true,
      allowRequestHeaders: '*',
      allowOrigins: '*',
      allowCredentials: false
    }

  }
};
