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

import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    // _id is automatically added by mongo
    _id: DS.attr('string'),

    // FHIR resources associated with this Communication
    // 'resource' is a CarePlan component... could be a Goal, Condition, etc.
    resource_id: DS.attr('string'),
    resource_type: DS.attr('string'),
    careplan_id: DS.attr('string'),
    patient_id: DS.attr('string'),

    // Communication is initiated by one user
    src_user_id: DS.attr('string'),
    src_user_name_first: DS.attr('string'),
    src_user_name_last: DS.attr('string'),

    // Communication is sent to multiple users; we keep track of who has seen it
    dest: DS.hasMany('comm-dest', {embedded: true}),

    // Communication has text content
    content: DS.attr('string'),

    // Communication is sent at a specific date/time
    timestamp: DS.attr('date', {defaultValue: Date.now}),

    /////////////////////////////////////////////
    // COMPUTED PROPERTIES
    session: Ember.inject.service('session'), // needed for ember-simple-auth

    isMe: Ember.computed('session.data.authenticated._id', 'src_user_id', function () {
        return this.get('session.data.authenticated._id') === this.get('src_user_id') || !this.get('src_user_id');
    }),

    timestamp_formatted: Ember.computed('timestamp', function () {
        return moment(this.get('timestamp')).format('MMM Do YYYY [@] h:mm:ss a');
    }),

    // gets/sets whether the currently logged-in user has seen this communication
    hasSeen: Ember.computed('dest', {
        get(/*key*/) {
            let userId = this.get('session.data.authenticated._id');
            let srcUser = this.get('src_user_id');
            let destUser = this.get('dest').findBy('user_id', userId);
            if (!srcUser || srcUser === userId) {
                // if the src user is blank, this is newly created (by us)
                // if this is created by us, we have seen it
                return true;
            }
            if (!destUser) {
                // dest user was not found
                return false;
            }
            return destUser.get('seen') === true;
        },
        set(key, value) {
            let userId = this.get('session.data.authenticated._id');
            let destUser = this.get('dest').findBy('user_id', userId);

            if (destUser) {
                // if this user is in the map of destinations for this comm, set the 'seen' value
                destUser.set('seen', value);
            } else {
                // otherwise, add this user to the map of destinations for this comm, and set the 'seen' value
                let obj = {user_id: userId, seen: value};
                destUser = this.store.createRecord('comm-dest', obj);
                this.get('dest').addObject(destUser);
            }
        }
    }),

    // the expanded view of a resource should show 1. unseen comms (even though they're immediately marked 'seen'),
    // and 2. comms that this user created
    unreadOrNew: Ember.computed(function () {
        return !this.get('hasSeen') || !this.get('_id');
    })
});
