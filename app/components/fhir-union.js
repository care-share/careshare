import Ember from 'ember';

export default Ember.Component.extend({
    isTypeChosen: false,
    isExpanded: false,
    allChoices: [],
    myChoice: {name: 'none', type: 'None selected'},
    setup: function () {
        this.set('allChoices', JSON.parse(this.get('choices')));
        console.log('root: ' + this.get('root'));
		console.log('allChoices: '+this.get('allChoices'));
        var parent = this.get('root');
        var me = this;
        var chosen = false;
        this.get('allChoices')
            .forEach(function (item) {
                console.log('Parent is: ' + parent + ' and choice is: ' + item.name);
                console.log('Field in parent is: ' + parent.get(item.name));
                if (!chosen && parent.get(item.name)) {
                    console.log('+++Match');
                    me.set('myChoice', item);
                    me.set('isTypeChosen', true);
                    chosen = true;
                } else if (!chosen) {
                    console.log('---No match');
                }
            });
    }.on("init"),
    actions: {
        setChoice: function (choice) {
            this.set('myChoice', choice);
            this.set('isExpanded', false);
            this.set('isTypeChosen', true);
            console.log('Type chosen: ' + this.get('myChoice'));
        },
        toggleExpanded: function () {
            console.log('Toggle expanded');
            this.set('isExpanded', !this.get('isExpanded'));
			console.log('Expanded = '+this.get('isExpanded'));
        }
    }
});
