import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    classNames: ['fhir-edit'],
    setup: function () {
        console.log('INIT: FHIR-EDIT- attribute: ' + this.get('attribute') + ',name: ' + this.get('name'));	
    }.on('init')
});
