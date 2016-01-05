import Ember from 'ember';

export default Ember.Component.extend({
    // args passed in from template: attribute
    tagName: 'span', // needed for Ember to build this in a HTML span element instead of a div
    classNames: ['fhir-edit'], // needed for Ember to add this CSS class to the HTML element
    setup: function () {
        console.log('INIT: FHIR-EDIT- attribute: ' + this.get('attribute'));
    }.on('init')
});
