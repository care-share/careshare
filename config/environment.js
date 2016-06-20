/*
 * Copyright 2016 The MITRE Corporation, All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint node: true */

module.exports = function (environment) {
    var ENV = {
        modulePrefix: 'careshare',
        environment: environment,
        baseURL: '/',
        locationType: 'auto',
        resizeServiceDefaults: {
            debounceTimeout    : 200,
            heightSensitive    : true,
            widthSensitive     : true,
            injectionFactories : [ 'view', 'component']
        },
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
            ENABLE_DS_FILTER: true,
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },
        exportApplicationGlobal: true, // needed to instruct 'ember-export-application-global' to export 'APP'
        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        }
    };

    ENV.APP.apiUrl = 'http://localhost:3001';

    if (process.env.domain) {
        // compute the API URL from CareShare environment variables
        // only 'domain' is required, 'use_tls' and 'port' are optional (will default to 'false' and '80', respectively)
        var proto;
        if (process.env.use_tls == 'true') {
            proto = 'https';
        } else {
            proto = 'http';
        }

        var port = process.env.port;
        if ((port == '80' && proto === 'http') || (port == '443' && proto === 'https') || port == '' || port == undefined) {
            port = '';
        } else {
            port = ':' + port;
        }

        ENV.APP.apiUrl = proto + '://api.' + process.env.domain + port;
        ENV.APP.fhirUrl = proto + '://fhir.' + process.env.domain + port;
    }

    if (process.env.is_openid == 'true') {
        ENV.APP.is_openid = true;
    }

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
