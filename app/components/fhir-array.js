import Ember from 'ember';

export default Ember.Component.extend({
    me: 'FHIR-ARRAY',
    expanded: false,
    currentHover: false,
    updateArray: 'updateArray',
    deleteArray: 'deleteArray',
    saveArray: 'saveArray',
    setup: function () {
        if (this.get('parent')) {
            console.log('[INIT] (' + this.get('me') + ') {record: ' +
                this.get('parent') + ',name: ' + this.get('name') + ',type: ' + this.get('type'));
        }
    }.on('init'),
    actions: {
        updateArray: function (parent, name, type) {
            console.log('(' + this.get('me') + ') UPDATE ARRAY - record: ' + parent + ',name: ' + name + ',type: ' + type);
            this.sendAction('updateArray', parent, name, type);
        },
        removeItem: function (index) {
            console.log('(' + this.get('me') + ') REMOVE ARRAY ITEM - parent: ' + this.get('parent') + ',index: ' + index);
            this.sendAction('removeItem', this.get('parent'), index);
        },
        toggleHover: function () {
            this.toggleProperty('currentHover');
        },
        toggleExpanded: function () {
            this.toggleProperty('expanded');
        }
    }
});
