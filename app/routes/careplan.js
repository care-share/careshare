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

import base from 'careshare/routes/base';
import Ember from 'ember';

export default base.extend({
    hideSideBar: true, // when this route renders its template, it will hide the side bar
    model: function (params) {
        var controller = this.controllerFor('careplan');
        console.log('Loading Careplan ROUTE');
        console.log(params);
        controller.set('id', params.careplan_id);

        this.store.unloadAll('CarePlan'); // first, remove any other care plans in the store (in case we transitioned from somewhere else)
        return this.store.find('CarePlan', params.careplan_id);
    },
    afterModel(/*model*/) {
        var controller = this.controllerFor('careplan');

        var comm = this.store.query('comm', {careplan_id: controller.id}); // find all comms for this careplan
        var condition = this.doQueries('Condition', true); // conditions
        var goal = this.doQueries('Goal', true); // goals
        var procedureRequest = this.doQueries('ProcedureRequest', true); // interventions
        var nutritionOrder = this.doQueries('NutritionOrder', true); // nutrition
        var medicationOrder = this.doQueries('MedicationOrder', true); // medications

        // we have to wait until the queries are all finished before we allow the route to render
        // this effectively causes the app to transition to App.LoadingRoute until the promise is resolved
        return Ember.RSVP.allSettled([comm, condition, goal, procedureRequest, nutritionOrder, medicationOrder]);
    },
    // do queries for a model (single name, not pluralized name)
    doQueries: function (modelName, doUnload) {
        if (doUnload) {
            // if we've already loaded records for another CarePlan, unload them first before continuing
            this.store.unloadAll(modelName);
        }
        var controller = this.controllerFor('careplan');
        var resource = 'CarePlan';
        var query = {_id: controller.id};
        var include;
        switch (modelName) {
            case ('Condition'):
                resource = 'Condition';
                query = {patient: this.controllerFor('patient').id};
                break;
            case ('Goal'):
                include = 'CarePlan:goal';
                break;
            case ('ProcedureRequest'):
            case ('NutritionOrder'):
                include = 'CarePlan:activityreference';
                // TODO: find a way to narrow down the target resource type for activityreference
                // should be possible according to: http://hl7.org/fhir/search.html#include
                // however, adding a third part (e.g. 'CarePlan:activityreference:ProcedureRequest') does not work
                break;
            case ('MedicationOrder'):
                resource = 'MedicationOrder';
                query = {patient: this.controllerFor('patient').id};
                include = 'MedicationOrder:medication';
                break;
        }
        if (include) {
            query._include = include;
        }

        // to get the "create" buttons to work properly, we need to query *then* peekAll
        return this.store.query(resource, query); // the "_include" is effectively a join
    },
    actions: {
        toggleShow: function (modelName) {
            var controller = this.controllerFor('careplan');
            var prop = 'show' + modelName.pluralize();
            controller.toggleProperty(prop);
            //if (controller.get(prop)) {
            //    this.doQueries(modelName);
            //}
        }
    }
});
