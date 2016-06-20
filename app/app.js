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

import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
    modulePrefix: config.modulePrefix,
    podModulePrefix: config.podModulePrefix,
    Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

var Handlebars;
Handlebars = Ember.Handlebars;
Handlebars.helper('header-format', function (value) {
    var escaped = Handlebars.Utils.escapeExpression(value);
    var n = escaped.indexOf('?');
    escaped = escaped.substring(0, n !== -1 ? n : escaped.length);
    escaped = escaped.replace('/', '');
    escaped = escaped.charAt(0)
            .toUpperCase() + escaped.slice(1);
    return new Ember.Handlebars.SafeString(escaped);
});
Handlebars.helper('is-admin', function (value) {
    console.log('is-admin: ' + JSON.stringify(value) + ';' + (value === 'admin'));
    return value === 'admin';
});

export default App;
