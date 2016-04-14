import Ember from 'ember';

export default Ember.Component.extend({
    // args passed in from template: parent, relation (string), display (string), label (string)
    classNames: ['related-list'], // needed for Ember to add this CSS class to the HTML element
    createRecord: 'createRecord',
    createRecordAndRelate: 'createRecordAndRelate',
    createRelation: 'createRelation',
    relatedListSelected: '---',
    type: null,
    textAreaValue: '',
    possibleChoices: [],
    setup: function () {
        let relation = this.get('relation');
        let typeVal = relation.toLowerCase();
        if (typeVal.includes('condition')) {
            this.set('type', 'Condition');
        } else if (typeVal.includes('goal')) {
            this.set('type', 'Goal');
        } else if (typeVal.includes('procedurerequest')) {
            this.set('type', 'ProcedureRequest');
        } else if (typeVal.includes('nutritionorder')) {
            this.set('type', 'NutritionOrder');
        } else if (typeVal.includes('medicationorder')) {
            this.set('type', 'MedicationOrder');
        }

        var relatedAttr = `parent.${relation}`;
        Ember.defineProperty(this, 'relations', Ember.computed(function () {
            return this.get(relatedAttr);
        }).property(relatedAttr));
        var unrelatedAttr = `parent.un${relation}`;
        Ember.defineProperty(this, 'possibleChoices', Ember.computed(function () {
            return this.get(unrelatedAttr);
        }).property(unrelatedAttr));
    }.on('init'),
    addReference: function (referringObject, referredObject, attributeName, isListAttribute, reference) {
        if (isListAttribute) { // for reference attributes with any allowed length
            var references = referringObject.get(attributeName).toArray();
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
    actions: {
        createRecordAndRelate: function (placeholderText) {
            console.log('createRecordAndRelate');
            this.set('textAreaValue', '');
            this.sendAction('createRecordAndRelate', this.get('type'), placeholderText, this.get('parent'), this);
        },
        createRelation: function (selection) {
            console.log('createRelation: ' + selection);
            this.sendAction('createRelation', selection, this.get('parent'), this);
        },
        selected: function (selection) {
            console.log('SELECTED: ' + selection.display);
            selection.model.toggleProperty('isExpanded');
        },
        deleteReference: function (from, to) {
            console.log("deleted: from (" + from + ") to (" + to + ")");
            var fromType = from._internalModel.modelName;
            var toType = to._internalModel.modelName;
            console.log(`Delete resource reference from ${fromType} ${from.id} to ${toType} ${to.id}`);

            // Architectural logic for how we delete the link:
            var that = this;
            var otherToGoal = function () {
                that.removeGoalRef(to, from);
            };
            var goalToOther = function () {
                that.removeGoalRef(from, to);
            };
            var otherToCondition = function () {
                that.removeConditionRef(to, from);
            };
            var conditionToOther = function () {
                that.removeConditionRef(from, to);
            };
            var map = {
                // to
                'goal': {
                    // from
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
            if (map[toType] && map[toType][fromType]) {
                map[toType][fromType]();
            } else {
                console.log('No link logic found!');
            }
        }
    },
    removeGoalRef: function (goal, other) {
        // remove the actual reference in the goal's Ember model and save that on the server
        var addresses = goal.get('addresses').toArray();
        for (var i = 0; i < addresses.length; i++) {
            var reference = addresses[i].get('reference').split('/');
            if (other.id === reference[1]) {
                goal.get('addresses').removeObject(addresses[i]);
            }
        }
        // save goal after loop is finished, in case there were multiple references to the same resource for some reason
        goal.save();
    },
    removeConditionRef: function (condition, other) {
        // remove the actual reference in the other's Ember model and save that on the server
        other.set('reasonReference', undefined);
        other.save();
    }
});
