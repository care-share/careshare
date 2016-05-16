import Ember from 'ember';

export default Ember.Component.extend({
    classNames: [], // apply this style to the div 'ember-view' wrapper element for this component
    // action dictionary/map:
    updateRecord: 'updateRecord', // this is needed to bubble this action to the respective controller action
    updateArraySingle: 'updateArraySingle', // this is needed to bubble this action to the respective controller action
    undoRecord: 'undoRecord', // this is needed to bubble this action to the respective controller action
    deleteRecord: 'deleteRecord', // this is needed to bubble this action to the respective controller action
    saveRecord: 'saveRecord', // this is needed to bubble this action to the respective controller action
    hoverOn: 'hoverOn', // this is needed to bubble this action to the respective controller action
    hoverOff: 'hoverOff', // this is needed to bubble this action to the respective controller action
    actions: {
        // expose these actions (bubble them up to the controller)
        updateRecord: function (parent, name, type) {
            this.sendAction('updateRecord', parent, name, type);
        },
        updateArraySingle: function (parent, name, type) {
            this.sendAction('updateArraySingle', parent, name, type);
        },
        undoRecord: function (model) {
            this.sendAction('undoRecord', model);
        },
        deleteRecord: function (model) {
            this.sendAction('deleteRecord', model);
        },
        saveRecord: function (model) {
            this.sendAction('saveRecord', model);
        },
        hoverOn: function (model) {
            this.sendAction('hoverOn', model);
        },
        hoverOff: function (model) {
            this.sendAction('hoverOff', model);
        }
    }
});
