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

import model from 'ember-fhir-adapter/models/medication-order';
import Ember from 'ember';
import DS from 'ember-data';
import commProps from 'careshare/properties/comm-properties';
import filter from 'careshare/properties/filter-properties';
import dirty from 'careshare/properties/dirty-property';
import display from 'careshare/properties/display-text-property';

export default model.extend({
    displayText: display('relatedMedication.code.text'),
    isNewRecord: Ember.computed.alias('currentState.isNew'),
    isExpanded: DS.attr('boolean', {defaultValue: false}),
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount,
    allCarePlans: Ember.computed(function() {
        return this.store.peekAll('care-plan');
    }),
    isRelatedToCarePlan: Ember.computed('allCarePlans.addresses.[]', function() {
        let carePlan = this.get('allCarePlans.firstObject');
        if (carePlan) {
            let reference = 'MedicationOrder/' + this.get('id');
            return carePlan.get('activity').mapBy('reference.reference').contains(reference);
        }
        return false;
    }),
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
    medicationId: Ember.computed('medicationReference', function() {
        let reference = this.get('medicationReference.reference');
        if (reference) {
            return reference.split('/')[1];
        }
        return null;
    }),
    medicationModel: Ember.computed('medicationId', function() {
        // need this 'intermediary attribute' to track whether the medication model has an error or not (i.e. deleted)
        let id = this.get('medicationId');
        if (id) {
            return this.store.peekRecord('medication', id);
        }
        return null;
    }),
    relatedMedication: filter.err1('medicationModel'),
    ////////////////////////////////////////////
    // DIRTY ATTRIBUTE DETECTION
    ////////////////////////////////////////////
    isUnclean: dirty.watch([], ['dosageInstruction.firstObject', 'reasonReference', 'relatedMedication.code'])
});
