import Ember from 'ember';

export default Ember.Component.extend({
    // args passed in from template: parent, relation (string), display (string), label (string)
    classNames: ['related-list'], // needed for Ember to add this CSS class to the HTML element
    originalSelections: null,
    refresh:true,
    createRelation: 'createRelation',
    relatedListSelected: '---',
    possibleChoices: [],
    setup: function () {
        if (this.get('parent')) {
            var display = this.get('display'); // which attribute we display for each resource
            // observe the [] property of the relation Set, so we get alerted when the content changes
            var observe = 'parent.' + this.get('relation') + '.[]';
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
                            display: observed[i].get(display)
                        });
                        this.get('possibleChoices').removeObject({
                            model: observed[i],
                            display: observed[i].get(display)
                        });
                    }
                }
                return selections;
            }).property(observe));

            this.set('originalSelections', this.get('selections'));
            var _this = this;
            this.set('possibleChoices',[]);
            this.get('model').forEach(function(item){
              var newSelection = new Object({model:item,display:item.get(display)});
              _this.get('originalSelections').forEach(function(selection){
                console.log('possibleChoices: newSelection '+newSelection.model+' equal to '+selection.model+(newSelection.model!==selection.model));
                if(_this.get('possibleChoices').contains(selection))
                  _this.get('possibleChoices').removeObject(selection);
                else if(newSelection.model !== selection.model && !_this.get('possibleChoices').contains(newSelection) &&
                    !_this.get('selections').contains(newSelection))
                  _this.get('possibleChoices').push(newSelection);
              });
            });
            console.log('[INIT] (RELATED-LIST) ' + this.get('originalSelections'));
        }
    }.on('init'),
    actions: {
        showChoice: function(item){
          console.log('showChoice: '+item);
        },
        createRelation: function(selection){
          console.log('createRelation: '+selection.model);
          this.sendAction('createRelation',selection.model,this.get('parent'));
          this.get('selections').removeObject(selection);
          this.get('possibleChoices').removeObject(selection);
          const _this = this;
          this.set('refresh', false);
          Ember.run.next(function () {_this.set('refresh', true);});
        },
        selected: function (selection) {
            console.log('SELECTED: ' + selection.display);
            if (this.get('lastExpanded') !== null && this.get('lastExpanded') === selection.model) {
                this.get('lastExpanded').set('isExpanded', !this.get('lastExpanded.isExpanded'));
            }
            else {
                if (this.get('lastExpanded') !== null) {
                    this.get('lastExpanded').set('isExpanded', false);
                }
                this.set('lastExpanded', selection.model);
                this.get('lastExpanded').set('isExpanded', true);
            }
        },
        deleteReference: function (from, to) {
            console.log("deleted: "+to);
            this.get('possibleChoices').push(to);
            const _this = this;
            this.set('refresh', false);
            Ember.run.next(function () {_this.set('refresh', true);});
            var fromType = from._internalModel.modelName;
            var toType = to.model._internalModel.modelName;
            console.log(`Delete resource reference from ${fromType} ${from.id} to ${toType} ${to.model.id}`);

            // Architectural logic for how we delete the link:
            var that = this;
            var otherToGoal = function () {
                that.removeGoalRef(to.model, from);
            };
            var goalToOther = function () {
                that.removeGoalRef(from, to.model);
            };
            var otherToCondition = function () {
                that.removeConditionRef(to.model, from);
            };
            var conditionToOther = function () {
                that.removeConditionRef(from, to.model);
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
