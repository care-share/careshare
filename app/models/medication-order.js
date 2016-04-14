import model from 'ember-fhir-adapter/models/medication-order';
import Ember from 'ember';
import commProps from 'careshare/properties/comm-properties';

export default model.extend({
    displayText: Ember.computed.alias('relatedMedication.code.text'),
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
    reasonId: Ember.computed('reasonReference', function() {
        let reference = this.get('reasonReference.reference');
        if (reference) {
            return reference.split('/')[1];
        }
        return null;
    }),
    relatedCondition: Ember.computed('reasonId', function() {
        let id = this.get('reasonId');
        if (id) {
            return this.store.peekRecord('condition', id);
        }
        return null;
    }),
    unrelatedCondition: Ember.computed('reasonId', function() {
        let id = this.get('reasonId');
        if (id) {
            return !this.store.peekRecord('condition', id);
        }
        return null;
    }),
    medicationId: Ember.computed('medicationReference', function() {
        let reference = this.get('medicationReference.reference');
        if (reference) {
            return reference.split('/')[1];
        }
        return null;
    }),
    relatedMedication: Ember.computed('medicationId', function() {
        let id = this.get('medicationId');
        if (id) {
            return this.store.peekRecord('medication', id);
        }
        return null;
    }),
    unrelatedMedication: Ember.computed('medicationId', function() {
        let id = this.get('medicationId');
        if (id) {
            return !this.store.peekRecord('medication', id);
        }
        return null;
    })
});
