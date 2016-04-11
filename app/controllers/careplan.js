import Ember from 'ember';
import API from '../api';

export default Ember.Controller.extend({
    // controller dependencies
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
    goals: Ember.computed(function() { // goals
        return this.store.peekAll('goal').filterBy('isError', false, {live: true});
    }),
    conditions: Ember.computed(function() { // problems
        return this.store.peekAll('condition').filterBy('isError', false, {live: true});
    }),
    nutritionOrders: Ember.computed(function() { // nutrition
        return this.store.peekAll('nutrition-order').filterBy('isError', false, {live: true});
    }),
    procedureRequests: Ember.computed(function() { // interventions
        return this.store.peekAll('procedure-request').filterBy('isError', false, {live: true});
    }),
    medicationOrders: Ember.computed(function() { // medications
        return this.store.peekAll('medication-order').filterBy('isError', false, {live: true});
    }),
    showGoals: true, // goals
    showConditions: true, // problems
    showNutritionOrders: false, // nutrition
    showProcedureRequests: true, // interventions
    showMedicationOrders: true, // medications
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
        referringObject.save();
    },
    toHighlight: Ember.Set.create(), // have to start out with an empty set, cannot be null/undefined
    actions: {
        createMessage: function (content, resource_id, resource_type) {
            console.log('CAREPLAN CREATE MESSAGE');
            var comm = {
                resource_type: resource_type,
                careplan_id: this.get('model.id'),
                patient_id: this.get('patient.id'),
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
