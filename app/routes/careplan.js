import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    model: function (params) {
        var controller = this.controllerFor('careplan');
        console.log('Loading Careplan ROUTE');
        console.log(params);
        controller.id = params.careplan_id;

        // TODO: change this to use new function for queries
        //var patientId = window.location.href.split('/')[4];
        //var mystore = this.store;
        //this.store.query('MedicationOrder', {'patient': patientId})
        //    .then(function (response) {
        //        var promises = [];
        //        var mrholder = [];
        //        response.forEach(function (mo) {
        //            var momr = mo.get('medicationReference');
        //            if (momr == null) {
        //                console.debug('No Medication Reference for ' + mo.get('id'));
        //                return;
        //            }
        //            mrholder[mrholder.length] = momr;
        //            var ref = momr.get('reference');
        //            var rid = ref.split('/')[1];
        //            var med = mystore.findRecord('medication', rid);
        //            promises[promises.length] = med;
        //        });
        //
        //        Ember.RSVP.all(promises)
        //            .then(function (res) {
        //                res.forEach(function (med) {
        //                    var mr = mrholder.shift();
        //                    mr.set('medication', med);
        //                });
        //                controller.set('MedicationOrder', response);
        //            });
        //    });
        return this.store.find('CarePlan', params.careplan_id);
    },
    afterModel(/*model*/) {
        var condition = this.doQueries('Condition', true); // conditions
        var goal = this.doQueries('Goal', true); // goals
        var procedureRequest = this.doQueries('ProcedureRequest', true); // interventions
        var nutritionOrder = this.doQueries('NutritionOrder', true); // nutrition
        // we have to wait until the queries are all finished before we allow the route to render
        // this effectively causes the app to transition to App.LoadingRoute until the promise is resolved
        return Ember.RSVP.allSettled([condition, goal, procedureRequest, nutritionOrder]);
    },
    // do queries for a model (single name, not pluralized name)
    doQueries: function (modelName, doUnload) {
        if (doUnload) {
            // if we've already loaded records for another CarePlan, unload them first before continuing
            this.store.unloadAll(modelName);
        }
        var include;
        switch (modelName) {
            case ('Condition'):
                include = 'CarePlan:condition';
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
        }
        var controller = this.controllerFor('careplan');
        // to get the "create" buttons to work properly, we need to query *then* peekAll
        return this.store.query('CarePlan', {_id: controller.id, _include: include}) // the "_include" is effectively a join
            .then(function (/*response*/) {
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
        },
        toggleShowMedications: function () {
            var controller = this.controllerFor('careplan');
            controller.toggleProperty('showMedicationOrders');
            if (controller.get('showMedicationOrders')) {
                // duplicate. figure out where ember wants helper code to live
                // or where this information should really be populated

                var patientId = window.location.href.split('/')[4];
                var mystore = this.store;
                this.store.query('MedicationOrder', {'patient': patientId})
                    .then(function (response) {
                        var promises = [];
                        var mrholder = [];
                        response.forEach(function (mo) {
                            var momr = mo.get('medicationReference');
                            if (momr == null) {
                                console.debug('No Medication Reference for ' + mo.get('id'));
                                return;
                            }
                            mrholder[mrholder.length] = momr;
                            var ref = momr.get('reference');
                            var rid = ref.split('/')[1];
                            var med = mystore.findRecord('medication', rid);
                            promises[promises.length] = med;
                        });

                        Ember.RSVP.all(promises)
                            .then(function (res) {
                                res.forEach(function (med) {
                                    var mr = mrholder.shift();
                                    mr.set('medication', med);
                                });
                                controller.set('MedicationOrders', response);
                            });
                    });
            }
        }
    }
});
