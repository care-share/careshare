import model from 'ember-fhir-adapter/models/condition';
import Ember from 'ember';
import DS from 'ember-data';
import nomChange from 'careshare/properties/nominations-change-property';
import commProps from 'careshare/properties/comm-properties';
import filter from 'careshare/properties/filter-properties';
import dirty from 'careshare/properties/dirty-property';

export default model.extend({
    displayText: Ember.computed.alias('code.text'),
    isNewRecord: Ember.computed.alias('currentState.isNew'),
    isExpanded: DS.attr('boolean', {defaultValue: false}),
    carePlanId: DS.attr('string'), // only passed from client -> server (so this attribute is not in the serializer)
    patientId: DS.attr('string'), // only passed from client -> server (so this attribute is not in the serializer)
    nominations: DS.attr('array'),
    acceptedNominations: DS.attr('array', {defaultValue: []}),
    rejectedNominations: DS.attr('array', {defaultValue: []}),
    changes: nomChange(),
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount,
    allCarePlans: Ember.computed(function() {
        return this.store.peekAll('care-plan');
    }),
    isRelatedToCarePlan: Ember.computed('allCarePlans.addresses.[]', function() {
        let carePlan = this.get('allCarePlans.firstObject');
        if (carePlan) {
            let reference = 'Condition/' + this.get('id');
            return carePlan.get('addresses').mapBy('reference').contains(reference);
        }
        return false;
    }),
    ////////////////////////////////////////////
    // INTERNAL RELATIONS
    ////////////////////////////////////////////
    _allGoals: Ember.computed(function() {
        return this.store.peekAll('goal');
    }),
    allGoals: filter.err('_allGoals'),
    _allProcedureRequests: Ember.computed(function() {
        return this.store.peekAll('procedure-request');
    }),
    allProcedureRequests: filter.err('_allProcedureRequests'),
    _allMedicationOrders: Ember.computed(function() {
        return this.store.peekAll('medication-order');
    }),
    allMedicationOrders: filter.err('_allMedicationOrders'),
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
    relatedProcedureRequests: Ember.computed('allProcedureRequests.@each.reasonId', function() {
        return this.get('allProcedureRequests').filter(function(item/*, index, enumerable*/) {
            return item.get('reasonId') === this.get('id');
        }, this);
    }),
    relatedMedicationOrders: Ember.computed('allMedicationOrders.@each.reasonId', function() {
        return this.get('allMedicationOrders').filter(function(item/*, index, enumerable*/) {
            return item.get('reasonId') === this.get('id');
        }, this);
    }),
    ////////////////////////////////////////////
    // DIRTY ATTRIBUTE DETECTION
    ////////////////////////////////////////////
    isUnclean: dirty.watch(['onsetDateTime', 'abatementDateTime'], ['code', 'severity', 'category'])
});
