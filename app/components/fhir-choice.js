import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'span',
    classNames: ['fhir-choice'],
    finalChoices: [],
    setup: function () {
        this.set('finalChoices', this.get('choices').split(','));
		console.log('INIT: FHIR-CHOICE- attribute: ' + this.get('attribute'));	
    }.on('init')
});