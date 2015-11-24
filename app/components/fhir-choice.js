import Ember from 'ember';

export default Ember.Component.extend({
    isEditing: false,
    tagName: 'span',    
    classNames: ['fhir-choice'],
    originalValue: '',
    finalChoices: [],
    actions: {
        editItem: function () {
            console.log('editItem');
            this.set('originalValue', this.get('attribute'));
            this.set('isEditing', true);
        },
        cancel: function () {
            console.log('cancel');
            this.set('attribute', this.get('originalValue'));
            this.set('isEditing', false);
        },
        saveItem: function () {
            console.log('saveItem');
            this.set('isEditing', false);
        },
        setChoice: function (choice) {
            this.set('attribute', choice);
        }
    },
    onInitialization: function () {
        this.set('finalChoices', this.get('choices').split(','));
        //$('.selectpicker').selectpicker();
    }.on('init')
});
