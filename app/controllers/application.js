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
import API from '../api';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    apiUrl: window.Careshare.apiUrl,
    isOpenID: window.Careshare.isOpenID,
    isSideBarDisplayed: false,
    lastLoginFailed: false,
    isShowingForm: true,
    accountRequestSucceeded: false,
    accountRequestFailed: false,
    errorMessage: 'An unknown error occurred.',
    errorType: 'alert-danger',
    patientCounter: 0,
    signInType: 'signin',
    showOpenID: false,
    hidden: false,
    noDisplay: false,
    actions: {
        accountRequest: function () {
            API.submitRequest(this.getProperties('first', 'last', 'email', 'pass'), this);
        },
        toggleSideBarVisibility: function () {
            console.log("SideBar toggleNoDisplay");
            this.toggleProperty('isSideBarDisplayed');
        },
        openidlogin: function (data) {
            console.log('App controller: openidlogin(' + data + ')');
            var that = this;
            return this.get('session')
                .authenticate('authenticator:custom', data)
                .then(function () {
                    that.send('checkTemplate');
                });
        },
        validate: function () {
            console.log('App controller: validate');
            var credentials = this.getProperties('identification', 'password');
            console.log('ID: ' + credentials.identification + ',PASS: ' + credentials.password);
            var that = this;
            return this.get('session')
                .authenticate('authenticator:custom', credentials)
                .then(function () {
                    that.send('checkTemplate');
                });
        },
        invalidate: function () {
            console.log('App controller: invalidate ' + JSON.stringify(this.get('session')));
            var credentials = this.getProperties('identification', 'password');
            var that = this;
            return this.get('session')
                .invalidate(credentials)
                .then(function () {
                    that.send('checkTemplate');
                });
        },
        patientsCount: function () {
            console.log('getPatientCount called!');
            return 5;
        }.property('model', 'patientCounter'),
        toggleLoginForm: function () {
            this.set('lastLoginFailed', false);
            this.set('accountRequestSucceeded', false);
            this.set('accountRequestFailed', false);
            this.toggleProperty('isShowingForm');
        },
        toggleHidden: function () {
            this.toggleProperty('hidden');
        },
        toggleNoDisplay: function () {
            this.toggleProperty('noDisplay');
        }

    }
});
