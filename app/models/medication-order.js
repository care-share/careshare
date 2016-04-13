import model from 'ember-fhir-adapter/models/medication-order';
import Ember from 'ember';
import commProps from 'careshare/properties/comm-properties';

export default model.extend({
    displayText: Ember.computed.alias('relatedMedication.code.text'),
    isExpanded: DS.attr('boolean', {defaultValue: false}),
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount,
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
