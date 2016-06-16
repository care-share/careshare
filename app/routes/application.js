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

import base from 'careshare/routes/base';

export default base.extend({
    renderTemplate: function () {
        console.debug(`CARESHARE: Route "${this.routeName}", renderTemplate()`);
        this.showOrHideSideBar();
        var url = window.location.href;
        console.log('url: ' + url);
        if (this.get('session.isAuthenticated')) {
            this.render('application');
        } else {
            this.render('login');
        }
    },
    setupController: function (controller) {
        console.log('is_openid: ' + window.Careshare.is_openid);
        if (window.Careshare.is_openid) {
            controller.set('signInType', 'signin-openid');
            controller.set('showOpenID', true);
        }
        else {
            controller.set('signInType', 'signin');
            controller.set('showOpenID', false);
        }
    },
    actions: {
        checkTemplate: function () {
            var url = window.location.href;
            console.log('application route: checkTemplate');
            console.log('url: ' + url);
            if (this.get('session.isAuthenticated')) {
                this.render('application');
            } else {
                this.render('login');
            }
        },
        renderPatient: function (id) {
            console.log('Rendering patient from Application');
            this.transitionTo('patient.filters', id);
        },
        queryParamsDidChange: function (params) {
            if (params != null) {
                console.log('params changed...');
                if (params['code'] != null) {
                    console.log('ACCESS CODE = ' + params['code']);
                    this.controllerFor('application')
                        .send('openidlogin', params);
                }
                else if (params['error'] != null) {
                    console.log('OPENID ERROR = ' + params['error']);
                    this.controllerFor('application')
                        .set('errorMessage', 'Cannot proceed without required permissions.');
                    this.controllerFor('application')
                        .set('errorType', 'alert-warning');
                    this.controllerFor('application')
                        .set('lastLoginFailed', true);
                }
            }
        },
        sessionAuthenticated: function () {
            this.controllerFor('application')
                .set('lastLoginFailed', false);
            this.send('checkTemplate');
        },
        sessionInvalidated: function (error) {
            this.controllerFor('application')
                .set('lastLoginFailed', true);
            var errorMessage = 'An unknown error occurred.';
            var errorType = 'alert-danger';
            console.log('Error: ' + error.status + ', ' + error.message);
            if (error.status === 'Unauthorized') {
                errorMessage = 'Invalid credentials.';
                errorType = 'alert-warning';
            }
            else if (error.status === 'Forbidden') {
                errorMessage = 'Your account has not yet been approved.';
                errorType = 'alert-info';
            }
            this.controllerFor('application')
                .set('errorMessage', errorMessage);
            this.controllerFor('application')
                .set('errorType', errorType);
            this.send('checkTemplate');
        }
    }
});
