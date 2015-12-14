import Ember from 'ember';

export default Ember.Component.extend({
    me: 'CODEABLE-CONCEPT',    
    classNames: ['codable-concept'],
    updateRecord: 'updateRecord',
    updateArray: 'updateArray',
    removeItem: 'removeItem',
    saveRecord: 'saveRecord',
    setup: function () {
        if (this.get('parent')) {
            console.log('[INIT] (' + this.get('me') + ') {record: ' + this.get('parent') + ',name: ' + this.get('name'));
			this.sendAction('updateRecord', this.get('parent'), this.get('name'), 'CodeableConcept');
        }
    }.on('init'),
    actions: {
        updateRecord: function (parent, name, type) {
            console.log('(' + this.get('me') + ') UPDATE RECORD - record: ' + parent + ',name: ' + name + ',type: ' + type);
            this.sendAction('updateRecord', parent, name, type);
        },
        saveRecord: function () {
            console.log('(' + this.get('me') + ') SAVE RECORD - record: ' + this.get('root'));
            this.sendAction('saveRecord', this.get('root'));
        },
        removeItem: function (record, index) {
            console.log('(' + this.get('me') + ') REMOVE ARRAY ITEM - parent: ' + record + ',index: ' + index);
            this.sendAction('removeItem', record, index);
        },
        updateArray: function (parent, name, type) {
            console.log('(' + this.get('me') + ') UPDATE ARRAY - record: ' + parent + ',name: ' + name + ',type: ' + type);
            this.sendAction('updateArray', parent, name, type);
        }
    }
});
