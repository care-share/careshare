import Ember from 'ember';
import uuid from 'ember-uuid/utils/uuid-generator';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    // the "carePlanRefAttr" field is set by child controllers
    actions: {
        createRecord: function (type, args) {
            // create a time-based ID so records can be sorted in chronological order by ID
            var dateTime = new Date().getTime();
            var newId = `${dateTime}-${uuid.v4()}`;
            console.log(`(CONTROLLER) CREATE RECORD - type: ${type}, id: ${newId}`);

            // add "<model> -> Patient" reference
            var patientId = this.controllerFor('patient').id;
            var patientRef = this.store.createRecord('reference', {
                reference: `Patient/${patientId}`
            });
            if (!args) {
                args = {};
            }
            args.id = newId;
            args.patient = patientRef;
            args.isNewRecord = true;
            if (type === 'Condition' || type === 'MedicationOrder') {
                args.isRelatedToCarePlan = true;
            }
            this.store.createRecord(type, args);

            // animate column
            var problemsColumn = Ember.$('#problems-column');
            problemsColumn.animate({scrollTop: problemsColumn.height() + 1000}, 'slow');
        },
        deleteRecord: function (record) {
            console.log('(CONTROLLER) REMOVE RECORD- record: ' + record);

            // remove "CarePlan -> <model>" reference
            var carePlan = this.controllerFor('careplan').get('model');
            var refs = carePlan.get(this.carePlanRefAttr)
                .toArray();
            var modelName = record._internalModel.modelName.camelize().capitalize();
            var that = this;
            for (var i = 0; i < refs.length; i++) {
                var ref = refs[i].get('reference');
                if (that.carePlanRefAttr === 'activity') {
                    // the CarePlan activity field requires a 'backbone' wrapper element...
                    ref = ref.get('reference');
                }
                if (ref === `${modelName}/${record.id}`) {
                    // remove the reference at this index in the array
                    refs.splice(i, 1);
                }
            }
            carePlan.set(this.carePlanRefAttr, refs);

            // only try to remotely delete the record if it exists on the server side
            if (record.get('isNewRecord')) {
                record.deleteRecord();
                return;
            }

            carePlan.save().then(function () {
                // remove this model
                that.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
                    const headers = {};
                    headers[headerName] = headerValue;
                    Ember.$.ajax({
                        type: 'DELETE',
                        url: `${window.Careshare.fhirUrl}/${modelName}/${record.id}`,
                        headers: headers,
                        success: function () {
                            // for some reason, .catch() is not working for Ember promises...
                            record.reload().then(function () {
                            }, function (err) {
                                console.log(`Deleted record ${record.id}, encountered an error! ${err.message}`);
                                // for a record that's been deleted from the FHIR server, err.errors[0].status should equal "410" (Gone)
                                // TODO: should we validate that the error we received is a code 410?
                                // for some reason, unloadRecord does not remove the record from the store if it is errored out...
                                // instead, when we peek from the store, we filter out models that have encountered errors
                                // so, this record will disappear from view
                            });
                        }
                    });
                });
            });
        },
        saveRecord: function (record) {
            console.log('(CONTROLLER) SAVE RECORD- record: ' + record);
            var modelName = record._internalModel.modelName.camelize().capitalize();
            var carePlan = this.controllerFor('careplan').get('model');
            var that = this;

            // check if this is a new record or if we are updating an existing one
            var isNewRecord = record.get('isNewRecord');
            if (isNewRecord) {
                record.set('isNewRecord', undefined);
            } else {
                var sessionRoles = this.get('session.data.authenticated.roles');
                if (sessionRoles && sessionRoles.indexOf('physician') > -1) {
                    // this is a physician user, is this a nomination for a new record?
                    var nominations = record.get('nominations');
                    if (nominations && nominations.length === 1 && nominations[0].action === 'create') {
                        isNewRecord = true;
                        record.set('acceptedNominations', [nominations[0].id]);
                    }
                }
            }
            record.set('carePlanId', carePlan.get('id'));

            // save this model
            record.save().then(function () {
                // iff this is a new record, add "CarePlan -> <model>" reference
                if (isNewRecord) {
                    var ref = that.store.createRecord('reference', {
                        reference: `${modelName}/${record.id}`
                    });
                    if (that.carePlanRefAttr === 'activity') {
                        // the CarePlan activity field requires a 'backbone' wrapper element...
                        ref = that.store.createRecord('care-plan-activity-component', {
                            reference: ref
                        });
                    }
                    var refs = carePlan.get(that.carePlanRefAttr)
                        .toArray();
                    refs.addObject(ref);
                    carePlan.set(that.carePlanRefAttr, refs);
                    carePlan.save();
                }
                record.reload();
            });
        },
        updateRecord: function (record, name, type) {
            console.log('(CONTROLLER) UPDATE RECORD - parent: ' + record + ',name: ' + name + ',type: ' + type);
            if (record && !record.get(`${name}.content`)) {
                var newRecord = this.store.createRecord(type, {});
                console.log('MODEL NAME: ' + record.toString());
                console.log('++NEW RECORD: ' + newRecord + '++');
                record.set(name, newRecord);
            } else {
                console.log('!!FAILED - parent does not exist or record already exists!!');
            }
        },
        undoRecord: function (record) {
            console.log('(' + this.get('me') + ') UNDO RECORD - record: ' + record);
            record.rollbackAttributes();
            record.reload();
        },
        updateArraySingle: function (record, name, type) {
            console.log('(CONTROLLER) UPDATE ARRAY SINGLE - parent: ' + record + ',name: ' + name + ',type: ' + type);
            if (record) {
                var array = record.get(name).toArray();
                if (array.length === 0) {
                    var newRecord = this.store.createRecord(type, {});
                    console.log('MODEL NAME: ' + record.toString());
                    console.log('++NEW RECORD: ' + newRecord + '++');
                    record.set(name, [newRecord]);
                }
            }
            else {
                console.log('!!FAILED - parent does not exist');
            }
        },
        updateArray: function (record, name, type) {
            console.log('(CONTROLLER) UPDATE ARRAY - parent: ' + record + ',name: ' + name + ',type: ' + type);
            var newRecord = this.store.createRecord(type, {});
            if (record) {
                console.log('Array exists - adding to array.');
                record.pushObject(newRecord);
            } else {
                console.log('Array does not exist - creating new array.');
                record = [newRecord];
            }
        },
        removeItem: function (record, index) {
            console.log('(CONTROLLER) REMOVE ARRAY ITEM - parent: ' + record + ',index: ' + index);
            if (record) {
                console.log('Array exists - removing item.');
                record.removeAt(index);
            }
        }
    }
});
