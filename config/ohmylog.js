/**
 * Custom logger
 */

module.exports.ohmylog = {
  file: {
    filename: 'bunker_pet.log',
    level: 'verbose'
  },

  exceptionFilename: 'exceptions.log',

  defaultLabel: 'bunker_pet',

  rotate: true,

  extras: [
    {
      name: 'request',
      console: true,
      file: {
        rotate: true,
        level: 'info'
      },
      fallback: true
    }, {
      name: 'broadcast',
      console: false,
      file: {
        rotate: true,
        level: 'debug'
      },
      fallback: false
    }, {
      name: 'externalcommunication',
      console: true,
      file: {
        rotate: true,
        level: 'verbose'
      }
    }, {
      name: 'cleaner',
      console: true,
      file: {
        rotate: true,
        level: 'verbose'
      }
    }
  ]
};
