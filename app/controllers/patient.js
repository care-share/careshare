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
    apiUrl: window.Careshare.apiUrl,
    patient: null,
    firstName: 'Unknown', lastName: 'Unknown', gender: 'Unknown', id: 'Unknown',
    isOpenID: window.Careshare.isOpenID,
    lastLoginFailed: false,
    isShowingForm: true,
    accountRequestSucceeded: false,
    accountRequestFailed: false,
    errorMessage: 'An unknown error occurred.',
    errorType: 'alert-danger',
    patientCounter: 0,
    signInType: 'signin',
    showOpenID: false,
    actions: {
        accountRequest: function () {
            API.submitRequest(this.getProperties('first', 'last', 'email', 'pass'), this);
        },
        openidlogin: function (data) {
            console.log('App controller: openidlogin(' + data + ')');
            return this.get('session')
                .authenticate('authenticator:custom', data);
        },
        validate: function () {
            console.log('App controller: validate');
            var credentials = this.getProperties('identification', 'password');
            console.log('ID: ' + credentials.identification + ',PASS: ' + credentials.password);
            return this.get('session')
                .authenticate('authenticator:custom', credentials);
        },
        invalidate: function () {
            console.log('App controller: invalidate ' + JSON.stringify(this.get('session')));
            var credentials = this.getProperties('identification', 'password');
            return this.get('session')
                .invalidate(credentials);
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
        }
    }
});
