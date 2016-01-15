import Ember from 'ember';

export default Ember.Component.extend({
    // args passed in from template: parent, name
    tagName: 'span', // needed for Ember to build this in a HTML span element instead of a div
    classNames: ['repeat'], // needed for Ember to add this CSS class to the HTML element
    // action dictionary/map:
    updateRecord: 'updateRecord', // this is needed to bubble this action to the respective controller action
    setup: function () {
        console.log('[INIT] (REPEAT) {record: ' + this.get('parent') + ',name: ' + this.get('name'));
        // causes the controller to create a Repeat object for this attribute ('name')
        this.sendAction('updateRecord', this.get('parent'), this.get('name'), 'TimingRepeatComponent');
        // TODO: perhaps ditch 'parent' and 'name' in favor of an 'attribute' that is directly tied to parent.name?
    }.on('init')
});
