import Ember from 'ember';

export default Ember.Component.extend({
    me: 'FHIR-ELEMENT',    
    classNames: ['fhir-element'],
    expanded: false,
    currentHover: false,
    updateRecord: 'updateRecord',
    deleteRecord: 'deleteRecord',
    saveRecord: 'saveRecord',
    setup: function () {
        if (this.get('parent')) {
            console.log('[INIT] (' + this.get('me') + ') {record: ' +
                this.get('parent') + ',name: ' + this.get('name') + ',type: ' + this.get('type'));
            this.sendAction('updateRecord', this.get('parent'), this.get('name'), this.get('type'));
        }
    }.on('init'),
    isTopLevel: function () {
            console.log("Root");
            console.log(this.get('root'));
            if (this.get('root')){
                return true;
            }
    },
    actions: {
        updateArray: function (parent, name, type) {
            console.log('(' + this.get('me') + ') UPDATE ARRAY - record: ' + parent + ',name: ' + name + ',type: ' + type);
            this.sendAction('updateArray', parent, name, type);
        },
        updateRecord: function (parent, name, type) {
            console.log('(' + this.get('me') + ') UPDATE RECORD - record: ' + parent + ',name: ' + name + ',type: ' + type);
            this.sendAction('updateRecord', parent, name, type);
        },
        deleteRecord: function () {
            console.log('(' + this.get('me') + ') DELETE RECORD - record: ' + this.get('root'));
            this.sendAction('deleteRecord', this.get('root'));
        },
        removeItem: function (index) {
            console.log('(' + this.get('me') + ') REMOVE ARRAY ITEM - parent: ' + this.get('parent') + ',index: ' + index);
            this.sendAction('removeItem', this.get('parent'), index);
        },
        saveRecord: function () {
            console.log('(' + this.get('me') + ') SAVE RECORD - record: ' + this.get('root'));
            this.sendAction('saveRecord', this.get('root'));
        },
        hoverOn: function () {
            this.set('currentHover', true);
        },
        hoverOff: function () {
            this.set('currentHover', false);
        },
        toggleExpanded: function () {
            this.toggleProperty('expanded');
            if (this.get('expanded') === false){
                this.set('currentHover', false);
            } 
        },
        expand: function () {
            this.set('expanded', true);
        }

    }
});
