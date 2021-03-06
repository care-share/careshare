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

import Ember from 'ember';
import uuid from "ember-uuid/utils/uuid-generator";

export default Ember.ObjectController.extend({
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
                    reference: `Condition/${condition.id}`,
                    display: condition.get('displayText')
                });
                console.log('condition display text: ' + condition.displayText);
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
                    that.transitionToRoute('careplan.filters', that.model.id, newId);
                }); // TODO: add catch for errors
        }
    }
});
