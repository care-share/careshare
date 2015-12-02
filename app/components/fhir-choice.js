import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',    
    classNames: ['fhir-choice'],
    originalValue: '',
    finalChoices: [],
    actions: {
        editItem: function () {
            console.log('editItem');
            this.set('originalValue', this.get('attribute'));
        },
        cancel: function () {
            console.log('cancel');
            this.set('attribute', this.get('originalValue'));
        },
        setChoice: function (choice) {
            this.set('attribute', choice);
        }
    },
    onInitialization: function () {
        this.set('finalChoices', this.get('choices').split(','));
    }.on('init'),
    didInsertElement: function(){
        $(".selectpicker").selectpicker()
    }
});