import model from 'ember-fhir-adapter/models/medication-order';
import Ember from 'ember';
import DS from 'ember-data';
import commProps from 'careshare/properties/comm-properties';
import filter from 'careshare/properties/filter-properties';
import dirty from 'careshare/properties/dirty-property';

export default model.extend({
    displayText: Ember.computed.alias('relatedMedication.code.text'),
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
