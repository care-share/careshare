import Ember from 'ember';
import API from '../api';

export default Ember.Controller.extend({
    // controller dependencies
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    needs: "patient",
    patient: Ember.computed.alias("controllers.patient"),
    // local vars
    apiUrl: window.Careshare.apiUrl,
    isOpenID: window.Careshare.isOpenID,
    isSideBarDisplayed: true,
    lastLoginFailed: false,
    isShowingForm: true,
    accountRequestSucceeded: false,
    accountRequestFailed: false,
    errorMessage: 'An unknown error occurred.',
    errorType: 'alert-danger',
    patientCounter: 0,
    signInType: 'signin',
    showOpenID: false,
    Goals: [], // goals
    Conditions: [], // problems
    NutritionOrders: [], // nutrition
    ProcedureRequests: [], // interventions
    MedicationOrders: [], // medications
    showGoals: true, // goals
    showConditions: true, // problems
    showNutritionOrders: true, // nutrition
    showProcedureRequests: true, // interventions
    showMedicationOrders: false, // medications
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
            referringObject.set(attributeName, [reference]);
        }
        referringObject.save();
    },
    addLocalRelation: function (from, to, relName) {
        if (!from.get(relName)) {
            from.set(relName, Ember.Set.create());
        }
        from.get(relName).add(to);
    },
    toHighlight: Ember.Set.create(), // have to start out with an empty set, cannot be null/undefined
    mGoals: function () {
        return this.applyHighlights('Goals');
    }.property('Goals', 'toHighlight'),
    mProblems: function () {
        return this.applyHighlights('Conditions');
    }.property('Conditions', 'toHighlight'),
    mNutrition: function () {
        return this.applyHighlights('NutritionOrders');
    }.property('NutritionOrders', 'toHighlight'),
    mInterventions: function () {
        return this.applyHighlights('ProcedureRequests');
    }.property('ProcedureRequests', 'toHighlight'),
    mMedications: function () {
        return this.applyHighlights('Medications');
    }.property('MedicationOrders', 'toHighlight'),
    applyHighlights: function (modelsKey) {
        var models = this.get(modelsKey);
        if (!models) {
            console.log(`applyHighlights(${modelsKey}) failed: field not found`);
            return [];
        }
        var toHighlight = this.get('toHighlight');
        models.forEach(function (model) {
            model.set('highlight', toHighlight.contains(model.id));
        });
        return models.sortBy('id');
    },
    highlightGoalRefs: function (newHighlights, model, ignoreReference) {
        // ignoreReference is optional
        var addresses = model.get('addresses').toArray();
        for (var i = 0; i < addresses.length; i++) {
            var reference = addresses[i].get('reference').split('/');
            if (reference[0].dasherize() !== ignoreReference && reference[1] !== model.id) {
                newHighlights.add(reference[1]);
            }
            if (!ignoreReference) {
                var relName = `rl${reference[0].camelize().capitalize().pluralize()}`;
                var related = this.store.peekRecord(reference[0], reference[1]);
                if (!related) {
                    // this may be an old reference to a model that no longer exists; skip this iteration
                    continue;
                }
                // add "Goal -> <model>" temporary descriptive reference
                this.addLocalRelation(model, related, relName);
            }
        }
    },
    doPeek: function (modelName) {
        // TODO: find a better way to force models (Goals, Conditions, etc.) to auto-update from the store
        // also see FIXME notes in routes/careplan.js
        var value = this.store.peekAll(modelName, {});
        this.set(modelName.pluralize(), value.toArray());
    },
    actions: {
        accountRequest: function () {
            API.submitRequest(this.getProperties('first', 'last', 'email', 'pass'), this);
        },
        toggleSideBarVisibility: function () {
            this.set('isSideBarDisplayed', false);
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
                // add a temporary descriptive reference directly to the model
                that.addLocalRelation(draggedObject, ontoObject, 'rlGoals');
            };
            var goalToOther = function () {
                that.addReference(draggedObject, ontoObject, 'addresses', true);
                // add a temporary descriptive reference directly to the model
                var relName = `rl${ontoModel.camelize().capitalize().pluralize()}`;
                that.addLocalRelation(draggedObject, ontoObject, relName);
            };
            var medToCondition = function () {
                that.addReference(draggedObject, ontoObject, 'reason', false);
            };
            var conditionToMed = function () {
                that.addReference(ontoObject, draggedObject, 'reason', false);
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
                    'medication-order': medToCondition
                },
                'procedure-request': {
                    'goal': goalToOther
                },
                'nutrition-order': {
                    'goal': goalToOther
                },
                'medication-order': {
                    'condition': conditionToMed
                }
            };
            if (map[ontoModel] && map[ontoModel][draggedModel]) {
                map[ontoModel][draggedModel]();
            } else {
                console.log('No link logic found!');
            }
        },
        hoverOn: function (model) {
            var modelName = model._internalModel.modelName;
            console.log('hoverOn: ' + modelName + ' ' + model.id);
            var newHighlights = Ember.Set.create();
            switch (modelName) {
                // TODO: is there a better/cleaner way to do this?
                case 'goal':
                    this.highlightGoalRefs(newHighlights, model);
                    break;
                case 'condition':
                case 'procedure-request':
                case 'nutrition-order':
                    var goals = this.get('Goals')
                        .toArray();
                    for (var c = 0; c < goals.length; c++) {
                        var goal = goals[c];
                        var addresses = goal.get('addresses').toArray();
                        for (var i = 0; i < addresses.length; i++) {
                            var reference = addresses[i].get('reference').split('/');
                            if (reference[1] === model.id) {
                                newHighlights.add(goal.id);
                                // first, store a temporary descriptive reference to the goal in this resource
                                // we need this to be able to show references in the expanded "edit" view of the resource
                                this.addLocalRelation(model, goal, 'rlGoals');
                                // highlight other relations to this goal, ignoring the current model type
                                this.highlightGoalRefs(newHighlights, goal, modelName);
                                break;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            this.set('toHighlight', newHighlights);
        },
        hoverOff: function (model) {
            var modelName = model._internalModel.modelName;
            console.log('hoverOff: ' + modelName + ' ' + model.id);
            var newHighlights = Ember.Set.create();
            this.set('toHighlight', newHighlights);
        }
    }
});
