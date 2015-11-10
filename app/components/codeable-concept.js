import Ember from 'ember';

export default Ember.Component.extend({
    me: 'CODEABLE-CONCEPT',
    updateRecord: 'updateRecord',
    updateArray: 'updateArray',
    removeItem: 'removeItem',
    saveRecord: 'saveRecord',
    setup: function () {
        if (this.get('parent')) {
            console.log('[INIT] (' + this.get('me') + ') {record: ' + this.get('parent') + ',name: ' + this.get('name'));
        }
    }.on('init'),
    actions: {
        updateRecord: function (parent, name, type) {
            console.log('(' + this.get('me') + ') UPDATE RECORD - record: ' + parent + ',name: ' + name + ',type: ' + type);
            this.sendAction('updateRecord', parent, name, type);
        },
        saveRecord: function () {
            console.log('(' + this.get('me') + ') SAVE RECORD');
            if (!this.get('root')) {
                this.get('parent').save();
            }
            else {
                this.get('root').save();
            }
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
