import base from 'careshare/routes/base';
import Ember from 'ember';

export default base.extend({
    hideSideBar: true, // when this route renders its template, it will hide the side bar
    model: function (params) {
        var controller = this.controllerFor('careplan');
        console.log('Loading Careplan ROUTE');
        console.log(params);
        controller.set('id', params.careplan_id);

        return this.store.find('CarePlan', params.careplan_id);
    },
    afterModel(model) {
        var controller = this.controllerFor('careplan');

        var comm = this.store.query('comm', {careplan_id: controller.id}); // find all comms for this careplan
        var condition = this.doQueries('Condition', true); // conditions
        var goal = this.doQueries('Goal', true); // goals
        var procedureRequest = this.doQueries('ProcedureRequest', true); // interventions
        var nutritionOrder = this.doQueries('NutritionOrder', true); // nutrition
        var medicationOrder = this.doQueries('MedicationOrder', true); // medications

        // we have to wait until the queries are all finished before we allow the route to render
        // this effectively causes the app to transition to App.LoadingRoute until the promise is resolved
        return Ember.RSVP.allSettled([comm, condition, goal, procedureRequest, nutritionOrder, medicationOrder])
            .then(function () {
                // figure out which Conditions and MedicationOrders are NOT related to the CarePlan
                var carePlan = model;

                function loop(modelName, attr, key) {
                    var array = controller.get(modelName.pluralize());
                    var related = carePlan.get(attr).toArray().map(function (item) {
                        return item.get(key).split('/')[1]; // return ID string for this reference
                    });
                    for (var i = 0; i < array.length; i++) {
                        if (related.contains(array[i].id)) {
                            array[i].set('isRelatedToCarePlan', true);
                        }
                        else {
                            array[i].set('isRelatedToCarePlan', false);
                        }
                    }
                }

                loop('Condition', 'addresses', 'reference');
                loop('MedicationOrder', 'activity', 'reference.reference');
            });
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
        return this.store.query(resource, query) // the "_include" is effectively a join
            .then(function (/*response*/) {
                //}, function (error) {
                //    // FIXME: FHIR adapter serializer encounters an error when the MedicationOrder query returns...
                //    // but apparently the records still get added to the store, so our "peekAll" can still execute just fine
                //    console.log(`Encountered an error when querying for "${modelName}": ${error.message}`);
                //}).finally(function() {
                // response from query is an AdapterPopulatedRecordArray; immutable and does not live-update changes to the template
                var value = controller.store.peekAll(modelName, {});
                // value from peekAll is a RecordArray; mutable and live-updates changes to the template
                controller.set(modelName.pluralize(), value.toArray());
                // FIXME: revisit this...
                // RecordArray should auto-update but does not seem to be triggering refresh of computed properties
                // however, hover-highlighting causes those computed properties to get refreshed?!
                // tried watching 'Model.[]' instead of 'Model' but that resulted in weird errors
                // As a temporary fix, we have implemented the "doPeek" method in the careplan controller, which we
                // manually call from sub-controllers
            });
    },
    actions: {
        toggleShow: function (modelName) {
            var controller = this.controllerFor('careplan');
            var prop = 'show' + modelName.pluralize();
            controller.toggleProperty(prop);
            if (controller.get(prop)) {
                this.doQueries(modelName);
            }
        }
    }
});
