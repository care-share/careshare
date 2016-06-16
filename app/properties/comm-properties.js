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

// used to add communication attributes to a model

export default {
    comms: Ember.computed(function() {
        var key;
        if (this._internalModel.modelName === 'care-plan') {
            key = 'careplan_id';
        } else if (this._internalModel.modelName === 'patient') {
            key = 'patient_id';
        } else {
            key = 'resource_id';
        }
        var value = this.get('id');
        return this.store.peekAll('comm').filterBy(key, value, {live: true});
        // note: in the above filter, the 'live: true' portion is used for the ember-data-live-filter-by addon
        // it instructs the addon to give us a live-updating array, so whenever another record is added to the store,
        // the array is recalculated!
    }),
    unreadCount: Ember.computed('comms.@each.hasSeen', function () {
        return this.get('comms').reduce(function(previousValue, communication){
            return previousValue + (communication.get('hasSeen') ? 0 : 1);
        }, 0);
    })
};
