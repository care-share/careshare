import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    classNames: ['fhir-object-select'],
    // action dictionary/map:
    updateRecord: 'updateRecord', // this is needed to bubble this action to the respective controller action
    setup: function () {
    }.on('init'),
    actions: {
        changed: function (input) {
            var attr = this.get('name');
            if (input === 'none') {
                this.get('parent').set(attr, undefined);
            } else {
                this.get('parent').set(attr, input);
            }
        },
        updateRecord: function (parent, name, type) {
            this.sendAction('updateRecord', parent, name, type);
        }
    }
});