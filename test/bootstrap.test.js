const sails = require('sails');
const Pact = require('bluebird');
const glob = require('glob');
const CLIEngine = require('eslint').CLIEngine;
const testModule = process.env.MODULE || '*';
const linterPath = ['models', 'services', 'controllers', 'policies'].includes(testModule)
  ? testModule + '/'
  : '/**/' + testModule;
const paths = glob.sync('./+(api|config)/' + linterPath + '*.js');
const engine = new CLIEngine({
  envs: ['node'],
  useEslintrc: true
});
const sequelize_fixtures = require('sequelize-fixtures');

function unexpectedCreation() {
  const err = new Error('Unexpected creation');

  err.isInvalid = true;
  throw err;
}

function unexpectedThen() {
  const err = new Error('Unexpected then');

  err.isInvalid = true;
  throw err;
}

function invalidSettings() {
  const err = new Error('Invalid settings');

  err.isInvalid = true;
  throw err;
}

function resolveCreation(err) {
  if (err.isInvalid == true) {
    return Pact.reject();
  }
  Pact.resolve();
}

before(function(done) {
  this.timeout(90000);

  sails.lift({
    hooks: {
      'session': false,
      'pubsub': false,
      'csrf': false,
      'i18n': false,
      'blueprints': false,
      'orm': false,
      'grunt': false
    },
    environment: 'test'
  }, function(err, sails) {
    if (err)
    {return done(err);}
    global.authtest = require('./helpers/auth_test');
    global.should = require('should');
    global.faker = require('faker');
    faker.locale = 'es_MX';

    global.factory = require('awsome-factory-associator');
    global.mockBackUp = _.cloneDeep(sails.config.mock);
    factory.load();

    faker.locale = 'es_MX';

    sails.unexpectedCreation = unexpectedCreation;
    sails.unexpectedThen = unexpectedThen;
    sails.resolveCreation = resolveCreation;
    sails.invalidSettings = invalidSettings;

    done(null, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});

afterEach(function() {
  sails.config.mock = _.cloneDeep(mockBackUp);
  if (this.currentTest.state !== 'passed') {
  }
});

beforeEach(function(done) {
  sails.services.modelutils.deleteAll()
    .then(() => {
      return authtest.getAuthAdmin();
    })
    .then((admin) => {
      global.authAdmin = admin;
      return authtest.getAuthCustomer();
    })
    .then((customer) => {
      global.authCustomer = customer;
    })
    .asCallback(done);
});
