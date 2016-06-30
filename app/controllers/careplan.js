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
import API from '../api';
import filter from 'careshare/properties/filter-properties';

export default Ember.Controller.extend({
    // controller dependencies
    percentageSplit: 50,
    topSplit: 35,
    botSplit: 65,
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    patient: Ember.inject.controller('patient'),
    // local vars
    apiUrl: window.Careshare.apiUrl,
    isOpenID: window.Careshare.isOpenID,
    lastLoginFailed: false,
    isShowingForm: true,
    accountRequestSucceeded: false,
    accountRequestFailed: false,
    errorMessage: 'An unknown error occurred.',
    errorType: 'alert-danger',
    patientCounter: 0,
    signInType: 'signin',
    showOpenID: false,

    callNumber: 0,
    valueModifier: false,

    _goals: Ember.computed(function() { // goals
        return this.store.peekAll('goal');
    }),
    goals: filter.err('_goals'), // filter out deleted records
    _conditions: Ember.computed(function() { // problems
        return this.store.peekAll('condition');
    }),
    conditions: filter.err('_conditions'), // filter out deleted records
    _nutritionOrders: Ember.computed(function() { // nutrition
        return this.store.peekAll('nutrition-order');
    }),
    nutritionOrders: filter.err('_nutritionOrders'), // filter out deleted records
    _procedureRequests: Ember.computed(function() { // interventions
        return this.store.peekAll('procedure-request');
    }),
    procedureRequests: filter.err('_procedureRequests'), // filter out deleted records
    _medicationOrders: Ember.computed(function() { // medications
        return this.store.peekAll('medication-order');
    }),
    medicationOrders: filter.err('_medicationOrders', 'displayText'), // filter out deleted records, sort by displayText
    showGoals: true, // goals
    showConditions: true, // problems
    showNutritionOrders: false, // nutrition
    showProcedureRequests: true, // interventions
    showMedicationOrders: true, // medications
    isUnclean: Ember.computed('goals.@each.isNewOrUnclean', 'conditions.@each.isNewOrUnclean',
        'nutritionOrders.@each.isNewOrUnclean', 'procedureRequests.@each.isNewOrUnclean',
        'medicationOrders.@each.isNewOrUnclean', function () {
            let resources = this.get('goals')
                .concat(this.get('conditions'))
                .concat(this.get('nutritionOrders'))
                .concat(this.get('procedureRequests'))
                .concat(this.get('medicationOrders'));
            // return true if any resource is unclean; return false if all resources are NOT unclean
            for (var i = 0; i < resources.length; i++) {
                if (resources[i].get('isNewOrUnclean')) {
                    return true;
                }
            }
            return false;
        }),
    showSplitScreen: false,
    splitStyle: function(){
        return this.get('showSplitScreen') ? "max-height: calc("  + this.get('topSplit') + 'vh - 95px)' : "";
    }.property('topSplit', 'showSplitScreen'),
    statusIsProposed: function () {
        return this.model.get('status') === 'proposed';
    }.property('model.status'),
    statusIsDraft: function () {
        return this.model.get('status') === 'draft';
    }.property('model.status'),
    statusIsActive: function () {
        return this.model.get('status') === 'active';
    }.property('model.status'),
    statusIsCompleted: function () {
        return this.model.get('status') === 'completed';
    }.property('model.status'),
    statusIsCancelled: function () {
        return this.model.get('status') === 'cancelled';
    }.property('model.status'),
    statusIsReferred: function () { // this one is not in the FHIR spec, but the server allows us to set it anyway
        return this.model.get('status') === 'referred';
    }.property('model.status'),
    colClass: Ember.computed('showGoals', 'showConditions', 'showNutritionOrders', 'showProcedureRequests', 'showMedicationOrders', function () {
        var numCol = this.get('showGoals') + this.get('showConditions') + this.get('showNutritionOrders') + this.get('showProcedureRequests') + this.get('showMedicationOrders');
        // Use Bootstrap class  : custom class
        return 12 % numCol === 0 ? "col-md-" + 12 / numCol : "col-xs-5ths";
    }),
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
    toHighlight: Ember.Set.create(), // have to start out with an empty set, cannot be null/undefined
    actions: {
        updateSplitPercentage: function(percentage){
            console.log("update splitPercentage: "+percentage)
            this.set('callNumber',this.get('callNumber')+1);
            if(this.get('callNumber') % 2 === 0){
                if((this.get('percentageSplit') <= 40 && percentage > 40) ||
                   (this.get('percentageSplit') > 40 && percentage <= 40)){
                    this.set('valueModifier',!this.get('valueModifier'));
                    console.log("UPDATE VALUE SWITCHED!!!");
                }
                console.log("update splitPercentage: "+percentage+",call number: "+this.get('callNumber')+",valueModifier: "+this.get('valueModifier'));
                if(this.get('valueModifier')){
                    this.set('percentageSplit',percentage);
                }
            }
        },
        toggleSplitScreen: function () {
            this.toggleProperty('showSplitScreen');
        },
        createMessage: function (content, resource_id, resource_type) {
            console.log('CAREPLAN CREATE MESSAGE');
            var comm = {
                resource_type: resource_type,
                careplan_id: this.get('model.id'),
                patient_id: this.get('patient.model.id'),
                resource_id: resource_id,
                content: content
            };
            var newMessage = this.store.createRecord('comm', comm);
            newMessage.save();
        },
        setStatus: function (newStatus) {
            console.log("setting Status!");
            this.model.set('status', newStatus);
            this.model.save();
        },
        accountRequest: function () {
            API.submitRequest(this.getProperties('first', 'last', 'email', 'pass'), this);
        },
        openidlogin: function (data) {
            console.log('App controller: openidlogin(' + data + ')');
            return this.get('session')
                .authenticate('authenticator:custom', data);
        },
        validate: function () {
            console.log('App controller: validate');
            var credentials = this.getProperties('identification', 'password');
            console.log('ID: ' + credentials.identification + ',PASS: ' + credentials.password);
            return this.get('session')
                .authenticate('authenticator:custom', credentials);
        },
        invalidate: function () {
            console.log('App controller: invalidate ' + JSON.stringify(this.get('session')));
            var credentials = this.getProperties('identification', 'password');
            return this.get('session')
                .invalidate(credentials);
        },
        patientsCount: function () {
            console.log('getPatientCount called!');
            return 5;
        }.property('model', 'patientCounter'),
        toggleLoginForm: function () {
            this.set('lastLoginFailed', false);
            this.set('accountRequestSucceeded', false);
            this.set('accountRequestFailed', false);
            this.toggleProperty('isShowingForm');
        },
        createRelation: function (draggedObject, options) {
            // only called when one element is dragged/dropped onto another
            var ontoObject = options.target.ontoObject;
            var ontoModel = ontoObject._internalModel.modelName;
            var draggedModel = draggedObject._internalModel.modelName;
            console.log(`createRelation called for ${draggedModel} to ${ontoModel}`);

            // Architectural logic for how we create the link:
            // (we need to know which type should be the referrer, and what attribute the reference list lives in, and whether that attribute allows multiple values)
            var that = this;
            var otherToGoal = function () {
                that.addReference(ontoObject, draggedObject, 'addresses', true);
            };
            var goalToOther = function () {
                that.addReference(draggedObject, ontoObject, 'addresses', true);
            };
            var otherToCondition = function () {
                that.addReference(draggedObject, ontoObject, 'reasonReference', false);
            };
            var conditionToOther = function () {
                that.addReference(ontoObject, draggedObject, 'reasonReference', false);
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
        hoverOn: function (model) {
            var newHighlights = Ember.Set.create();
            switch (model._internalModel.modelName) {
                // TODO: is there a better/cleaner way to do this?
                // Clearly there is now with the need for nested if's inside the switch
                case 'goal':
                    this.highlightGoalToRefs(newHighlights, model);
                    break;
                case 'condition':
                    this.highlightFromConditionRefs(newHighlights, model);
                    this.highlightGoalFromRefs(newHighlights, model);
                    break;
                case 'procedure-request':
                    this.highlightToConditionRefs(newHighlights, model);
                    this.highlightGoalFromRefs(newHighlights, model);
                    break;
                case 'nutrition-order':
                    this.highlightGoalFromRefs(newHighlights, model);
                    break;
                case 'medication-order':
                    this.highlightToConditionRefs(newHighlights, model);
                    break;
                default:
                    break;
            }
            this.set('toHighlight', newHighlights);
        },
        hoverOff: function (/*model*/) {
            var newHighlights = Ember.Set.create();
            this.set('toHighlight', newHighlights);
        }
    },
    highlightToConditionRefs: function (newHighlights, model) {
        // model is a ProcedureRequest or a MedicationOrder
        let conditionId = model.get('reasonId');
        if (conditionId) {
            newHighlights.add(conditionId);
        }
    },
    highlightFromConditionRefs: function (newHighlights, condition) {
        let models = condition.get('relatedProcedureRequests');
        models = models.concat(condition.get('relatedMedicationOrders'));
        let modelIds = models.mapBy('id');
        newHighlights.addEach(modelIds);
    },
    highlightGoalToRefs: function (newHighlights, goal, ignoreReference) {
        let models = [];
        if (ignoreReference !== 'condition') {
            models = models.concat(goal.get('relatedConditions'));
        }
        if (ignoreReference !== 'procedure-request') {
            models = models.concat(goal.get('relatedProcedureRequests'));
        }
        if (ignoreReference !== 'nutrition-order') {
            models = models.concat(goal.get('relatedNutritionOrders'));
        }
        let modelIds = models.mapBy('id');
        newHighlights.addEach(modelIds);
    },
    highlightGoalFromRefs: function (newHighlights, model) {
        var modelName = model._internalModel.modelName;
        let goals = model.get('relatedGoals');
        for (let i = 0; i < goals.length; i++) {
            let goal = goals[i];
            newHighlights.add(goal.get('id'));
            // highlight other relations to this goal, ignoring the current model type
            this.highlightGoalToRefs(newHighlights, goal, modelName);
        }
    }
});
