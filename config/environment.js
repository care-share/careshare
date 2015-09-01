/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'careshare',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    /*contentSecurityPolicy: {
      'default-src': "'unsafe-inline'",
      'script-src': "'unsafe-inline'",
      'font-src': "'unsafe-inline'",
      'connect-src': "'unsafe-inline'",
      'img-src': "*'unsafe-inline'",
      'style-src': "'unsafe-inline'",
      'frame-src': "'unsafe-inline'"
    },*/
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    exportApplicationGlobal: true, // needed to instruct "ember-export-application-global" to export "APP"
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.APP.apiUrl = 'http://localhost:3001';
  if (process.env.domain) {
    // compute the API URL from CareShare environment variables
    // only "domain" is required, "use_tls" and "port" are optional (will default to "false" and "80", respectively)
    var protocol;
    if (process.env.use_tls == 'true')
      protocol = 'https';
    else
      protocol = 'http';
    var port = '';
    if (process.env.port && process.env.port !== 80 && process.env.port !== 443)
      port = ':' + process.env.port;
    ENV.APP.apiUrl = protocol + '://api.' + process.env.domain + port;
  }

  ENV['simple-auth'] = {
    authorizer: 'authorizer:custom',
    store: 'simple-auth-session-store:local-storage',
    crossOriginWhitelist: [ENV.APP.apiUrl]
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
