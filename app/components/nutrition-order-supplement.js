import Ember from 'ember';

export default Ember.Component.extend({
    // args passed in from template: parent, name
    tagName: 'span', // needed for Ember to build this in a HTML span element instead of a div
    classNames: ['nutrition-order-supplement'], // needed for Ember to add this CSS class to the HTML element
    // action dictionary/map:
    updateArray: 'updateRecord', // this is needed to bubble this action to the respective controller action
    setup: function () {
        console.log('[INIT] (nutrition-order-supplement) {record: ' + this.get('parent'));
        
        var supplements = this.get('parent').get('supplement').toArray();
       
        //TODO: This is a shortcut because we make an Improper? assumption that there will only be one supplement 
        // supplements.addObject(supplement);
        //If this supplement doesnt exist, create it
        if ( !(supplements && supplements[0]) ){
            var supplement = this.get('parent').store.createRecord('NutritionOrderSupplementComponent', { });
            supplements[0] = supplement;
            this.get('parent').set('supplement', supplements);
        }
        
        
        // causes the controller to create a NutritionOrderSupplementComponent  array object for this attribute ('supplement')
        //this.sendAction('updateRecord', this.get('parent'), "supplement.0", 'NutritionOrderSupplementComponent');
    }.on('init')
});
