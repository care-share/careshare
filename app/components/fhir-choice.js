import Ember from 'ember';

export default Ember.Component.extend({
    // args passed in from template: attribute, choices (string of CSVs)
    tagName: 'span', // needed for Ember to build this in a HTML span element instead of a div
    classNames: ['fhir-choice'], // needed for Ember to add this CSS class to the HTML element
    choiceList: [],
    setup: function () {
        // TODO: support passing an array instead of a string of CSVs? (download list of codes for things)
        this.set('choiceList', this.get('choices').split(','));
		console.log('INIT: FHIR-CHOICE- attribute: ' + this.get('attribute'));	
    }.on('init')
});