import Ember from 'ember';

export default Ember.Component.extend({
    me: 'related-list',
    classNames: ['related-list'],
	originalSelections: null,
    setup: function () {
        if (this.get('parent')) {
			this.set('originalSelections',this.get('selections'));
			this.get('originalSelections').forEach(function(item){
			    console.log('selection: '+item.display);
			});
            console.log('[INIT] (' + this.get('me') + ') '+this.get('originalSelections'));
        }
    }.on('init'),
    onInitialization: function () {
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
                }
            }
            return selections;
        }).property(observe));
    }.on('init'),
    actions: {
	    selected: function(selection){
		    console.log('SELECTED: '+selection.display);			
			if(this.get('lastExpanded') !== null && this.get('lastExpanded') === selection.model){
			    this.get('lastExpanded').set('isExpanded',!this.get('lastExpanded.isExpanded'));
			}
			else{
			    if(this.get('lastExpanded') !== null){
				    this.get('lastExpanded').set('isExpanded',false);
			    }
			    this.set('lastExpanded',selection.model);
			    this.get('lastExpanded').set('isExpanded',true);	
			}	
		},
        deleteReference: function (from, to) {
            var fromType = from._internalModel.modelName;
            var toType = to._internalModel.modelName;
            console.log(`Delete resource reference from ${fromType} ${from.id} to ${toType} ${to.id}`);
            switch (fromType, toType) {
                case ('condition', 'goal'):
                case ('procedure-request', 'goal'):
                    this.removeGoalRef(to, from);
                    break;
                case ('goal', 'condition'):
                case ('goal', 'procedure-request'):
                    this.removeGoalRef(from, to);
                    break;
                // TODO: add more cases
                default:
                    console.log('no reference logic found');
            }
        }
    },
    removeGoalRef: function (goal, other) {
        // first remove the temporary descriptive reference we are storing in the resource
        var relName = `rl${other._internalModel.modelName.camelize().capitalize().pluralize()}`;
        this.removeLocalRelation(goal, other, relName);
        this.removeLocalRelation(other, goal, 'rlGoals');

        // now, remove the actual reference in the goal's Ember model and save that on the server
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
    removeLocalRelation: function (from, to, relName) {
        var relation = from.get(relName);
        if (relation) {
            relation.removeObject(to);
        }
    }
});