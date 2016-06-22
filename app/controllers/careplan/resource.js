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
import uuid from 'ember-uuid/utils/uuid-generator';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    careplan: Ember.inject.controller('careplan'),
    latestRecord: null,
    createRelation: 'createRelation',
    addReference: function (referringObject, referredObject, attributeName, isListAttribute) {
        // creates a FHIR reference to referredObject and adds it to the attribute named in listName
        var reference = this.store.createRecord('reference', {
            reference: `${referredObject._internalModel.modelName}/${referredObject.id}`
        });
        if (isListAttribute) { // for reference attributes with any allowed length
            var references = referringObject.get(attributeName)
                .toArray();
            // TODO: should add logic to check if the reference already exists
            // We end up adding duplicates, but that won't break anything for now
            references.addObject(reference);
            referringObject.set(attributeName, references);
        } else { // for reference attributes that allow only one value
            referringObject.set(attributeName, reference);
        }
        console.log(referringObject);
    },
    actions: {
        createRecordAndRelate: function(type,placeholderText,parent,root){
          var args = {};
          if(type === "Condition" || type === "ProcedureRequest")
            args.code = this.store.createRecord('codeable-concept',{'text':placeholderText});
          else if(type === "Goal")
            args.description = placeholderText;
          else if(type === "NutritionOrder"){
            //TODO: need clause for nutrition-order ('supplement.firstObject.productName')
          }else if(type === "MedicationOrder"){
            //TODO: need clause for medication-order ('relatedMedication.code.text')
          }

          this.send('createRecord',type, args,true,parent,root);
          console.log('createRecordAndRelate record created: '+this.get('latestRecord'));
          //this.get('latestRecord').save();
          //this.send('createRelation',this.get('latestRecord'),this);
        },
        createRelation: function (draggedObject, options){
          this.send('createRelation',draggedObject,options,null);
        },
        createRelation: function (draggedObject, options, root) {
            var ontoObject = (options.target !== null && options.target !== undefined)?options.target.ontoObject:options;
            var ontoModel = ontoObject._internalModel.modelName;
            var draggedModel = draggedObject._internalModel.modelName;
            console.log(`createRelation called for ${draggedModel} to ${ontoModel}`);

            // Architectural logic for how we create the link:
            // (we need to know which type should be the referrer, and what attribute the reference list lives in, and whether that attribute allows multiple values)
            var that = this;
            if(root !== null && root != undefined) that = root;

            var draggedObjectRecord = this.store.createRecord('reference', {
                reference: `${draggedObject._internalModel.modelName}/${draggedObject.id}`
            }),
            ontoObjectRecord = this.store.createRecord('reference', {
                reference: `${ontoObject._internalModel.modelName}/${ontoObject.id}`
            });

            var inner = this;
            var otherToGoal = function () {
                inner.addReference(ontoObject, draggedObject, 'addresses', true,draggedObjectRecord);
            };
            var goalToOther = function () {
                inner.addReference(draggedObject, ontoObject, 'addresses', true,ontoObjectRecord);
            };
            var otherToCondition = function () {
                inner.addReference(draggedObject, ontoObject, 'reasonReference', false,ontoObjectRecord);
            };
            var conditionToOther = function () {
                inner.addReference(ontoObject, draggedObject, 'reasonReference', false,draggedObjectRecord);
            };

            var map = {
                // ontoModel
                'goal': {
                    // draggedModel
                    'condition': otherToGoal,
                    'procedure-request': otherToGoal,
                    'nutrition-order': otherToGoal
                },
                'condition': {
                    'goal': goalToOther,
                    'medication-order': otherToCondition,
                    'procedure-request': otherToCondition
                },
                'procedure-request': {
                    'goal': goalToOther,
                    'condition': conditionToOther
                },
                'nutrition-order': {
                    'goal': goalToOther
                },
                'medication-order': {
                    'condition': conditionToOther
                }
            };
            if (map[ontoModel] && map[ontoModel][draggedModel]) {
                map[ontoModel][draggedModel]();
            } else {
                console.log('No link logic found!');
            }
        },
        createRecord: function (type, args) {
          this.send('createRecord',type, args,false,null,null);
        },
        createRecord: function (type, args, link, parent,root) {
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
            if (type === 'Condition' || type === 'MedicationOrder') {
                args.isRelatedToCarePlan = true;
            }

            var latestRecord = this.store.createRecord(type,args);
            if(link == true) this.send('createRelation',latestRecord,parent,root);

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
            if (!isNewRecord) {
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
            var carePlanId = carePlan.get('id');
            if (record.get('isRelatedToCarePlan') === false) {
                // for HH users, conditions that are not directly related to the care plan should not get this
                // carePlanId set in the resulting nomination
                carePlanId = '';
            }
            record.set('carePlanId', carePlanId);
            record.set('patientId', this.controllerFor('patient').id);

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
                // get the canonical record again, because some of our changes may have been converted to Nominations,
                // or some of our accepted/rejected Nominations may have been converted to real changed attributes
                record.reload().then(function () {
                    // wipe properties that would make 'isUnclean' true
                    record.set('cleanSnapshot', undefined);
                    record.set('acceptedNominations', []);
                    record.set('rejectedNominations', []);

                    record.eachRelationship(function(name, relationship) {
                        // when the record gets reloaded, if previously defined attributes have become undefined, Ember does
                        // not detect that that 'canonical state' has changed. we must manually check all relationships and
                        // fudge the canonical state so this record does not trigger our dirty attribute checks
                        let target = record.get(`${name}.content`);
                        if (relationship.kind === 'belongsTo') {
                            let isDirty = record.get(`${name}.hasDirtyAttributes`);
                            if (isDirty && target._internalModel.currentState.stateName === 'root.loaded.updated.uncommitted') {
                                that.cleanseRecord(target);
                            }
                        } else if (relationship.kind === 'hasMany') {
                            // first, the current state may now contain duplicate entries because these record references don't have ID attributes
                            // we need to remove duplicate references
                            // NOTE: this only seems to happen for newly-created records that have been saved already (but before the page is reloaded)
                            let array = target.toArray();
                            let map = {};
                            for (let i = 0; i < array.length; i++) {
                                let item = array[i];
                                let reference = item.get('reference');
                                if (!map[reference]) {
                                    map[reference] = item;
                                } else {
                                    // we have a duplicate! remove the one with a null ID
                                    if (item.get('id') === null) {
                                        target.removeObject(item);
                                    } else {
                                        target.removeObject(map[reference]);
                                    }
                                }
                            }
                            // now, check to see if the canonical state is different from the current state
                            let value = 'record.reference';
                            // TODO: we make the assumption that 'hasMany' relationships will always contain record references... is there a better way?
                            let n1 = target.currentState.mapBy(value);
                            let n2 = target.canonicalState.mapBy(value);
                            if (Ember.compare(n1, n2) !== 0) {
                                //let array = [];
                                //for (let i = 0; i < target.currentState.length; i++) {
                                //    let related = target.currentState[i].record;
                                //    array.push(related);
                                //}
                                //record.set(name, array);
                                target.canonicalState = target.currentState.slice(); // clone array
                            }
                        }
                        record.set('isExpanded', false); // minimize resource after it is saved
                    });
                });
            });
        },
        updateRecord: function (record, name, type) {
            console.log('(CONTROLLER) UPDATE RECORD - parent: ' + record + ',name: ' + name + ',type: ' + type);
            if (record && !record.get(`${name}.content`)) {
                var newRecord = this.store.createRecord(type, {});
                console.log('MODEL NAME: ' + record.toString());
                console.log('++NEW RECORD: ' + newRecord + '++');
                this.cleanseRecord(newRecord);
                // add the new record to the existing parent record
                record.set(name, newRecord);
            } else {
                console.log('!!FAILED - parent does not exist or record already exists!!');
            }
        },
        undoRecord: function (record) {
            console.log('(' + this.get('me') + ') UNDO RECORD - record: ' + record);
            let isExpanded = record.get('isExpanded');
            record.rollbackAttributes();
            let that = this;
            record.eachRelationship(function(name, relationship) {
                let target = record.get(`${name}.content`);
                if (relationship.kind === 'belongsTo') {
                    if (target && typeof target.rollbackAttributes === 'function') {
                        target.rollbackAttributes();
                        if (target._internalModel.currentState.stateName === 'root.loaded.updated.uncommitted') {
                            // this is an empty record that was created by our fhir element component
                            // rollbackAttributes won't work correctly, we need to fudge the state
                            that.cleanseRecord(target);
                        }
                    }
                } else if (relationship.kind === 'hasMany') {
                    let array = [];
                    for (let i = 0; i < target.canonicalState.length; i++) {
                        let related = target.canonicalState[i].record;
                        if (typeof related.rollbackAttributes === 'function') {
                            related.rollbackAttributes();
                        }
                        array.push(related);
                    }
                    record.set(name, array);
                }
            });
            record.set('isExpanded', isExpanded);
            let acceptedNominations = record.get('acceptedNominations');
            let rejectedNominations = record.get('rejectedNominations');
            if (acceptedNominations) {
                acceptedNominations.clear();
            }
            if (rejectedNominations) {
                rejectedNominations.clear();
            }
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
    },
    cleanseRecord: function (record) {
        // trick Ember Data into thinking that the new record is not dirty
        // (for our purposes, it is not dirty because it is new;
        // it should become dirty when the user changes an attribute)
        record._internalModel.send('willCommit');
        record._internalModel._attributes = {};
        record._internalModel.send('didCommit');
    }
});
