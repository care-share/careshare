import Ember from 'ember';

export default Ember.Component.extend({
    // args passed in from template: parent, relation (string), display (string), label (string)
    classNames: ['related-list'], // needed for Ember to add this CSS class to the HTML element
    originalSelections: null,
    setup: function () {
        if (this.get('parent')) {
            this.set('originalSelections', this.get('selections'));
            console.log('[INIT] (RELATED-LIST) ' + this.get('originalSelections'));
        }
    }.on('init'),
    onInitialization: function () {
        // observe the [] property of the relation Set, so we get alerted when the content changes
        var observe = 'parent.' + this.get('relation');
        var observeProperty = observe + '.@each.displayText';
        Ember.defineProperty(this, 'selections', Ember.computed(function () {
            var selections = [];
            var set = this.get(observe); // get the Set that we are observing
            if (set) {
                var observed = set.toArray() // convert the Set to an Array
                    .sortBy('id'); // sort the Array by ID (so the order matches up with what is in the resource column)
                for (var i = 0; i < observed.length; i++) {
                    // create an array of objects of type {model, display}
                    // reason is that each object will have some display property, but different model types will have
                    // different fields for this
                    selections.push({
                        model: observed[i],
                        display: observed[i].get('displayText')
                    });
                }
            }
            return selections;
        }).property(observeProperty));
    }.on('init'),
    actions: {
        selected: function (selection) {
            console.log('SELECTED: ' + selection.display);
            selection.model.toggleProperty('isExpanded');
        },
        deleteReference: function (from, to) {
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