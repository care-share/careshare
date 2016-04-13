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
    setup: function(){
        var typeVal = this.get('relation').toLowerCase();
        if(typeVal.includes('condition')) this.set('type','Condition');
        else if(typeVal.includes('goal')) this.set('type','Goal');
        else if(typeVal.includes('procedurerequest')) this.set('type','ProcedureRequest');
        else if(typeVal.includes('nutritionorder')) this.set('type','NutritionOrder');
        else if(typeVal.includes('medicationorder')) this.set('type','MedicationOrder');

        Ember.defineProperty(this,'relations',Ember.computed(function(){
          console.log('relations changed!');
          this.set('possibleChoices',this.get('parent').get('un'+this.get('relation')));
          return this.get('parent').get(this.get('relation'));
        }).property('parent.'+this.get('relation')));
    }.on('init'),
    actions: {
        createRecordAndRelate: function(placeholderText){
          console.log('createRecordAndRelate');
          this.sendAction('createRecordAndRelate',this.get('type'),placeholderText);
          this.set('textAreaValue', '');
          //this.send('createRelation',this.get('controller').get('latestRecord'));
        },
        createRelation: function(selection){
          console.log('createRelation: '+selection);
          this.sendAction('createRelation',selection,this.get('parent'));
        },
        selected: function (selection) {
            console.log('SELECTED: ' + selection.displayText);
            if (this.get('lastExpanded') !== null && this.get('lastExpanded') === selection) {
                this.get('lastExpanded').set('isExpanded', !this.get('lastExpanded.isExpanded'));
            }
            else {
                if (this.get('lastExpanded') !== null) {
                    this.get('lastExpanded').set('isExpanded', false);
                }
                this.set('lastExpanded', selection);
                this.get('lastExpanded').set('isExpanded', true);
            }
        },
        deleteReference: function (from, to) {
            console.log("deleted: from ("+from+") to ("+to+")");
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
