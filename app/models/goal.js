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

import model from 'ember-fhir-adapter/models/goal';
import Ember from 'ember';
import DS from 'ember-data';
import nomChange from 'careshare/properties/nominations-change-property';
import commProps from 'careshare/properties/comm-properties';
import filter from 'careshare/properties/filter-properties';
import dirty from 'careshare/properties/dirty-property';
import display from 'careshare/properties/display-text-property';

export default model.extend({
    displayText: display('description'),
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
    _allConditions: Ember.computed(function() {
        return this.store.peekAll('condition');
    }),
    allConditions: filter.err('_allConditions'),
    _allProcedureRequests: Ember.computed(function() {
        return this.store.peekAll('procedure-request');
    }),
    allProcedureRequests: filter.err('_allProcedureRequests'),
    _allNutritionOrders: Ember.computed(function() {
        return this.store.peekAll('nutrition-order');
    }),
    allNutritionOrders: filter.err('_allNutritionOrders'),
    addressesIds: Ember.computed('addresses.[]', function() {
        return this.get('addresses').map(function(item/*, index, enumerable*/) {
            // return the string ID of the reference
            return item.get('reference').split('/')[1];
        }, this);

    }),
    relatedConditions: Ember.computed('allConditions', 'addressesIds', function() {
        return this.get('allConditions').filter(function(item/*, index, enumerable*/) {
            return this.get('addressesIds').contains(item.id);
        }, this);
    }),
    unrelatedConditions: Ember.computed('allConditions', 'addressesIds', function() {
        return this.get('allConditions').filter(function(item/*, index, enumerable*/) {
            return !this.get('addressesIds').contains(item.id);
        }, this);
    }),
    relatedProcedureRequests: Ember.computed('allProcedureRequests', 'addressesIds', function() {
        return this.get('allProcedureRequests').filter(function(item/*, index, enumerable*/) {
            return this.get('addressesIds').contains(item.id);
        }, this);
    }),
    unrelatedProcedureRequests: Ember.computed('allProcedureRequests', 'addressesIds', function() {
        return this.get('allProcedureRequests').filter(function(item/*, index, enumerable*/) {
            return !this.get('addressesIds').contains(item.id);
        }, this);
    }),
    relatedNutritionOrders: Ember.computed('allNutritionOrders', 'addressesIds', function() {
        return this.get('allNutritionOrders').filter(function(item/*, index, enumerable*/) {
            return this.get('addressesIds').contains(item.id);
        }, this);
    }),
    unrelatedNutritionOrders: Ember.computed('allNutritionOrders', 'addressesIds', function() {
        return this.get('allNutritionOrders').filter(function(item/*, index, enumerable*/) {
            return !this.get('addressesIds').contains(item.id);
        }, this);
    }),
    ////////////////////////////////////////////
    // DIRTY ATTRIBUTE DETECTION
    ////////////////////////////////////////////
    isUnclean: dirty.watch(['description', 'status', 'targetDate'], ['priority', 'category', 'addresses.[]'])
});
