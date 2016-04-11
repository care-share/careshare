import model from 'ember-fhir-adapter/models/condition';
import Ember from 'ember';
import commProps from 'careshare/properties/comm-properties';

export default model.extend({
    displayText: Ember.computed.alias('code.text'),
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount,
    ////////////////////////////////////////////
    // INTERNAL RELATIONS
    ////////////////////////////////////////////
    allGoals: Ember.computed(function() {
        return this.store.peekAll('goal');
    }),
    allProcedureRequests: Ember.computed(function() {
        return this.store.peekAll('procedure-request');
    }),
    allMedicationOrders: Ember.computed(function() {
        return this.store.peekAll('medication-order');
    }),
    relatedGoals: Ember.computed('allGoals.@each.addressesIds', function() {
        return this.get('allGoals').filter(function(item/*, index, enumerable*/) {
            return item.get('addressesIds').contains(this.get('id'));
        }, this);
    }),
    relatedProcedureRequests: Ember.computed('allProcedureRequests.@each.reasonId', function() {
        return this.get('allProcedureRequests').filter(function(item/*, index, enumerable*/) {
            return item.get('reasonId') === this.get('id');
        }, this);
    }),
    relatedMedicationOrders: Ember.computed('allMedicationOrders.@each.reasonId', function() {
        return this.get('allMedicationOrders').filter(function(item/*, index, enumerable*/) {
            return item.get('reasonId') === this.get('id');
        }, this);
    })
});