import model from 'ember-fhir-adapter/models/procedure-request';
import Ember from 'ember';
import DS from 'ember-data';
import nomChange from 'careshare/properties/nominations-change-property';
import commProps from 'careshare/properties/comm-properties';

export default model.extend({
    displayText: Ember.computed.alias('code.text'),
    carePlanId: DS.attr('string'), // only passed from client -> server (so this attribute is not in the serializer)
    patientId: DS.attr('string'), // only passed from client -> server (so this attribute is not in the serializer)
    nominations: DS.attr('array'),
    acceptedNominations: DS.attr('array', {defaultValue: []}),
    rejectedNominations: DS.attr('array', {defaultValue: []}),
    changes: nomChange(),
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
    allGoals: Ember.computed(function() {
        return this.store.peekAll('goal');
    }),
    relatedGoals: Ember.computed('allGoals.@each.addressesIds', function() {
        return this.get('allGoals').filter(function(item/*, index, enumerable*/) {
            return item.get('addressesIds').contains(this.get('id'));
        }, this);
    }),
    unrelatedGoals: Ember.computed('allGoals.@each.addressesIds', function() {
        return this.get('allGoals').filter(function(item/*, index, enumerable*/) {
            return !item.get('addressesIds').contains(this.get('id'));
        }, this);
    })
});
