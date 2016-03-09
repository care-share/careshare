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
    addLocalRelation: function (from, to, relName, isSingleItem) {
        if (isSingleItem) {
            from.set(relName, to);
        } else {
            if (!from.get(relName)) {
                from.set(relName, Ember.Set.create());
            }
            from.get(relName).add(to);
        }
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
        var medOrders = this.get('MedicationOrders')
            //.filterBy('medicationReference') // find medicationorders that have medication references
            //.filterBy('medicationReference.medication', false); // filter to only return those that don't have local references
            .filter(function (item/*, index, enumerable*/) {
                return item.get('medicationReference.medication') === undefined;
            });
        for (var i = 0; i < medOrders.length; i++) {
            var medRef = medOrders[i].get('medicationReference');
            if (medRef && !medRef.medication) {
                var reference = medRef.get('reference').split('/');
                var med = this.store.peekRecord(reference[0], reference[1]);
                if (med) {
                    // add a local reference to the actual Medication record from this Reference
                    medRef.set('medication', med);
                }
            }
        }
        return this.applyHighlights('MedicationOrders');
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
    doPeek: function (modelName) {
        // TODO: find a better way to force models (Goals, Conditions, etc.) to auto-update from the store
        // also see FIXME notes in routes/careplan.js
        var value = this.store.peekAll(modelName, {})
            .toArray()
            .filterBy('isError', false); // this is needed to prevent showing records that have been deleted
        this.set(modelName.pluralize(), value);
    },
    actions: {
        createMessage: function(content,resource_id,resource_type){
          console.log('CAREPLAN CREATE MESSAGE');
          this.store.createRecord('comm',{id: Math.random(),
                                  resource_type:resource_type,
                                  careplan_id:this.get('model.id'),
                                  resource_id:resource_id,
                                  content:content,
                                  timestamp:new Date(),
                                  src_user_id:this.get('session.data.authenticated.name_first')
                                });
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
                // add a temporary descriptive reference directly to the model
                // we only need to add a local relation for the draggedObject; the ontoObject gets its relation added onMouseOver
                that.addLocalRelation(draggedObject, ontoObject, 'rlGoals');
            };
            var goalToOther = function () {
                that.addReference(draggedObject, ontoObject, 'addresses', true);
                // add a temporary descriptive reference directly to the model
                // we only need to add a local relation for the draggedObject; the ontoObject gets its relation added onMouseOver
                var relName = `rl${ontoModel.camelize().capitalize().pluralize()}`;
                that.addLocalRelation(draggedObject, ontoObject, relName);
            };
            var otherToCondition = function () {
                that.addReference(draggedObject, ontoObject, 'reasonReference', false);
                // add a temporary descriptive reference directly to the model
                // we only need to add a local relation for the draggedObject; the ontoObject gets its relation added onMouseOver
                that.addLocalRelation(draggedObject, ontoObject, 'rlCondition', true);
            };
            var conditionToOther = function () {
                that.addReference(ontoObject, draggedObject, 'reasonReference', false);
                // add a temporary descriptive reference directly to the model
                // we only need to add a local relation for the draggedObject; the ontoObject gets its relation added onMouseOver
                var relName = `rl${ontoModel.camelize().capitalize().pluralize()}`;
                that.addLocalRelation(draggedObject, ontoObject, relName);
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
        if (model.get('reasonReference.reference')) {
            var reference = model.get('reasonReference.reference').split('/');
            var condition = this.store.peekRecord(reference[0], reference[1]);
            if (!condition) {
                // this may be an old reference to a model that no longer exists; skip this
                return;
            }
            newHighlights.add(condition.id);
            // add "<model> -> Condition" temporary descriptive reference
            this.addLocalRelation(model, condition, 'rlCondition', true);
        }
    },
    highlightFromConditionRefs: function (newHighlights, condition) {
        var models = this.get('ProcedureRequests').toArray();
        models = models.concat(this.get('MedicationOrders').toArray());
        for (var c = 0; c < models.length; c++) {
            var model = models[c];
            var modelName = model._internalModel.modelName;
            if (model.get('reasonReference.reference')) {
                var reference = model.get('reasonReference.reference').split('/');
                if (reference[1] === condition.id) {
                    newHighlights.add(model.id);
                    // store a temporary descriptive reference to the resource in this condition
                    // we need this to be able to show references in the expanded "edit" view of the condition
                    var relName = `rl${modelName.camelize().capitalize().pluralize()}`;
                    this.addLocalRelation(condition, model, relName);
                }
            }
        }
    },
    highlightGoalToRefs: function (newHighlights, model, ignoreReference) {
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
    highlightGoalFromRefs: function (newHighlights, model) {
        var modelName = model._internalModel.modelName;
        var goals = this.get('Goals').toArray();
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
                    this.highlightGoalToRefs(newHighlights, goal, modelName);
                    break;
                }
            }
        }
    }
});
