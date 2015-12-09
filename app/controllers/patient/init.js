import Ember from 'ember';
import uuid from "ember-uuid/utils/uuid-generator";

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

            // create a time-based ID so records can be sorted in chronological order by ID
            var dateTime = new Date().getTime();
            var newId = `${dateTime}-${uuid.v4()}`;
            var carePlan = this.store.createRecord('care-plan', {
                id: newId,
                subject: subjectReference,
                addresses: addressesConditions
            });

            // save the care plan, and after we save it, redirect to a plan that belongs to the patient
            // this is not quite correct -- we're not guaranteed that we're getting the right care plan if the patient has more than one
            // unfortunately, the adapter is not handling the id provided by the POST response
            var that = this;
            carePlan.save()
                .then(function (/*savedCarePlan*/) {
                    that.store.find('CarePlan', {
                            subject: that.model.id
                        })
                        .then(function (response) {
                            if (response != null) {
                                var careplans = response.toArray();
                                if (careplans.length > 0) {
                                    that.transitionToRoute('careplan', careplans[0]);
                                }
                            }
                        });
                }); // TODO: add catch for errors
        }
    }
});
