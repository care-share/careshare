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

import patient from 'ember-fhir-adapter/models/patient';
import DS from 'ember-data';
import Ember from 'ember';
import commProps from 'careshare/properties/comm-properties';

export default patient.extend({
    fullName: Ember.computed('name', function () {
        let firstHumanName = this.get('name');
        if (firstHumanName) {
            return `${firstHumanName.get('firstObject.family')}, ${firstHumanName.get('firstObject.given')}`;
        }
        return 'Unknown';
    }),
    birthDateFormatted: Ember.computed('birthDate', function () {
        let value = this.get('birthDate');
        let date = moment(value).format('MMM Do, YYYY');
        let age = moment().diff(value, 'years');
        return `${date} (${age} yrs old)`;
    }),
    birthDateOnlyFormatted: Ember.computed('birthDate', function () {
        let value = this.get('birthDate');
        let date = moment(value).format('MMM Do, YYYY');
        let age = moment().diff(value, 'years');
        return `${date}`;
    }),
    ageFormatted: Ember.computed('birthDate', function () {
        let value = this.get('birthDate');
        let date = moment(value).format('MMM Do, YYYY');
        let age = moment().diff(value, 'years');
        return `${age} Years Old`;
    }),
    genderFormatted: Ember.computed('gender', function () {
        let gender = this.get('gender');
        return gender.charAt(0).toUpperCase() + gender.substr(1);
    }),
    conditions: DS.hasMany('condition', {'async': true}),
    carePlans: Ember.computed(function () {
        let reference = 'Patient/' + this.get('id');
        return this.store.peekAll('care-plan').filterBy('subject.reference', reference, {live: true});
    }),
    hasNominations: DS.attr('boolean'),
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount
});
