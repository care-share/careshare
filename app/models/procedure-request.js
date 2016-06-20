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

import model from 'ember-fhir-adapter/models/procedure-request';
import Ember from 'ember';
import DS from 'ember-data';
import nomChange from 'careshare/properties/nominations-change-property';
import commProps from 'careshare/properties/comm-properties';
import filter from 'careshare/properties/filter-properties';
import dirty from 'careshare/properties/dirty-property';

export default model.extend({
    displayText: Ember.computed('code.text', 'clinicalStatus', function () {
        let text = this.get('code.text');
        if (!text) {
            text = '[No description]';
        }
        let suffix = '';
        let status = this.get('clinicalStatus');
        if (status) {
            suffix = ` (${status})`;
        }
        return `${text}${suffix}`;
    }),
    isNewRecord: Ember.computed.alias('currentState.isNew'),
    isExpanded: DS.attr('boolean', {defaultValue: false}),
    carePlanId: DS.attr('string'), // only passed from client -> server (so this attribute is not in the serializer)
    patientId: DS.attr('string'), // only passed from client -> server (so this attribute is not in the serializer)
    nominations: DS.attr('array'),
    acceptedNominations: DS.attr('array', {defaultValue: function() {return [];}}),
    rejectedNominations: DS.attr('array', {defaultValue: function() {return [];}}),
    changes: nomChange(),
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount,
    ////////////////////////////////////////////
    // INTERNAL RELATIONS
    ////////////////////////////////////////////
    reasonId: Ember.computed('reasonReference.reference', function() {
        let reference = this.get('reasonReference.reference');
        if (reference) {
            return reference.split('/')[1];
        }
        return null;
    }),
    reasonModel: Ember.computed('reasonId', function() {
        // need this 'intermediary attribute' to track whether the reason model has an error or not (i.e. deleted)
        let id = this.get('reasonId');
        if (id) {
            return this.store.peekRecord('condition', id);
        }
        return null;
    }),
    relatedCondition: filter.err1('reasonModel'),
    _allGoals: Ember.computed(function() {
        return this.store.peekAll('goal');
    }),
    allGoals: filter.err('_allGoals'),
    relatedGoals: Ember.computed('allGoals.@each.addressesIds', function() {
        return this.get('allGoals').filter(function(item/*, index, enumerable*/) {
            return item.get('addressesIds').contains(this.get('id'));
        }, this);
    }),
    unrelatedGoals: Ember.computed('allGoals.@each.addressesIds', function() {
        return this.get('allGoals').filter(function(item/*, index, enumerable*/) {
            return !item.get('addressesIds').contains(this.get('id'));
        }, this);
    }),
    ////////////////////////////////////////////
    // DIRTY ATTRIBUTE DETECTION
    ////////////////////////////////////////////
    isUnclean: dirty.watch(['priority', 'orderedOn'], ['code', 'reasonReference', 'scheduledTiming.repeat'])
});
