module.exports = {

  connection: 'development',

  models: {
    connection: 'development',
    migrate: 'drop'
  },
  
  connections: {
    'development': {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: 5432,
      dialect: 'postgres',
      options: {
        dialect: 'postgres',
        host: process.env.DB_NETWORK,
        port: 5432,
        logging: false,
        operatorsAliases: false
      }
    }
  }


};
