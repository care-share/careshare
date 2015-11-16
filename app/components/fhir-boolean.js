import Ember from 'ember';

export default Ember.Component.extend({
    isEditing: false,
    originalValue: false,
	watchAttribute: function(){
		console.log('attribute changed!');
	}.observes('attribute'),
    setup: function () {
        console.log('INIT: FHIR-BOOLEAN- attribute: ' + this.get('attribute') + ',name: ' + this.get('name'));
    }.on('init'),
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
        }
    }
});