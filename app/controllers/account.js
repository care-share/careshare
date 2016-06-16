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
    mUser: undefined,
    mFhirId: undefined,
    mSearch: '',
    mPractitioners: [],
    mClose: false,
    mSubmitting: false,
    actions: {
        modalToggle: function (toggler) {
            var user = toggler.get('user');
            this.set('mUser', user);
            this.set('mFhirId', user.fhir_id);
            this.set('mSearch', user.name_last);
            this.set('mPractitioners', []);
            this.findPractitioners();
        },
        modalSearch: function () {
            this.findPractitioners();
        },
        modalSetFhirId: function (fhir_id) {
            this.set('mFhirId', fhir_id);
        },
        modalSubmit: function () {
            // change user's FHIR ID in local storage
            var fhir_id = this.get('mFhirId');
            this.set('mUser.fhir_id', fhir_id);
            // change user's FHIR ID in the database
            API.changeFhirId(this.get('mUser._id'), fhir_id, this.get('session.data.authenticated'), this);
            // clear props
            this.set('mUser', undefined);
            this.set('mFhirId', undefined);
            this.set('mSearch', '');
            this.set('mPractitioners', []);
            this.set('mClose', true);
        },
        reset: function () {
            this.get('target')
                .send('reset', this);
        },
        approve: function (id) {
            console.log('approve(controller) called');
            this.get('target')
                .send('approve', id, this.get('session.data.authenticated'), this);
        },
        deny: function (id) {
            console.log('deny(controller) called');
            this.get('target')
                .send('deny', id, this.get('session.data.authenticated'), this);
        },
        toggleRole: function (id, role, isHeld) {
            console.log('toggleRole(controller) called');
            if (!isHeld) {
                this.get('target')
                    .send('addRole', id, role, this.get('session.data.authenticated'), this);
            } else {
                this.get('target')
                    .send('removeRole', id, role, this.get('session.data.authenticated'), this);
            }
        }
    },
    findPractitioners: function () {
        var search = this.get('mSearch');
        this.set('mIsSearching', true);
        var that = this;
        this.store.query('practitioner', {name: search, _count: 10})
            .then(function (response) {
                that.set('mPractitioners', response);
            }, function (error) {
                console.log('Error retrieving practitioners: ' + error);
            })
            .finally(function () {
                that.set('mIsSearching', false);
            });
    }
});
