import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'span',
    classNames: ['fhir-choice'],
    finalChoices: [],
    actions: {
        saveItem: function (choice) {
            this.set('attribute', choice.target.selectedOptions[0].value);
        }
    },
    onInitialization: function () {
        this.set('finalChoices', this.get('choices').split(','));
    }.on('init')
});