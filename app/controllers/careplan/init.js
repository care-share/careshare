import Ember from 'ember';

export default Ember.ObjectController.extend({
//  needs: 'patients',
//  patientsController: Ember.computed.alias('controllers.patients'),
//    patientController: Ember.inject.controller('patient'),
//    patient: Ember.computed.reads('patientsController.model'),
//  givenName: Ember.computed.reads('patient.name.given'),
    selectedConditions: [], // for multi-select-checkboxes
    actions: {
        initializeCarePlan: function () {
            var subjectReference = this.store.createRecord('reference', {
                reference: `Patient/${this.model.id}`
            });
            var addressesConditions = [];
            for (var i = 0; i < this.selectedConditions.length; i++) {
                var condition = this.selectedConditions[i];
                var conditionReference = this.store.createRecord('reference', {
                    reference: `Condition/${condition.id}`
                });
                addressesConditions.pushObject(conditionReference);
            }
            var carePlan = this.store.createRecord('care-plan', {
                subject: subjectReference,
                addresses: addressesConditions
            });
            carePlan.save();
        }
    }
});
