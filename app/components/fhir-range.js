import Ember from 'ember';

export default Ember.Component.extend({
    // args passed in from template: parent, name, type
    // action dictionary/map:
    updateRecord: 'updateRecord', // this is needed to bubble this action to the respective controller action
    updateArray: 'updateArray', // this is needed to bubble this action to the respective controller action
    removeItem: 'removeItem', // this is needed to bubble this action to the respective controller action
    saveRecord: 'saveRecord', // this is needed to bubble this action to the respective controller action
    setup: function () {
        if (this.get('parent')) {
            console.log('[INIT] (RANGE) {record: ' + this.get('parent') + ',name: ' + this.get('name'));
        }
    }.on('init'),
    actions: {
        // TODO: do we need these actions? remove them if not
        updateRecord: function (parent, name, type) {
            console.log('(RANGE) UPDATE RECORD - record: ' + parent + ',name: ' + name + ',type: ' + type);
            this.sendAction('updateRecord', parent, name, type);
        },
        saveRecord: function () {
            console.log('(RANGE) SAVE RECORD');
            if (!this.get('root')) {
                this.get('parent').save();
            }
            else {
                this.get('root').save();
            }
        },
        removeItem: function (record, index) {
            console.log('(RANGE) REMOVE ARRAY ITEM - parent: ' + record + ',index: ' + index);
            this.sendAction('removeItem', record, index);
        },
        updateArray: function (parent, name, type) {
            console.log('(RANGE) UPDATE ARRAY - record: ' + parent + ',name: ' + name + ',type: ' + type);
            this.sendAction('updateArray', parent, name, type);
        }
    }
});