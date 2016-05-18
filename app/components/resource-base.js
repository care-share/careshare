import Ember from 'ember';

export default Ember.Component.extend({
    classNames: [], // apply this style to the div 'ember-view' wrapper element for this component
    // action dictionary/map:
    createRelation: 'createRelation',// this is needed to bubble this action to the respective controller action
    updateRecord: 'updateRecord', // this is needed to bubble this action to the respective controller action
    updateArraySingle: 'updateArraySingle', // this is needed to bubble this action to the respective controller action
    undoRecord: 'undoRecord', // this is needed to bubble this action to the respective controller action
    deleteRecord: 'deleteRecord', // this is needed to bubble this action to the respective controller action
    saveRecord: 'saveRecord', // this is needed to bubble this action to the respective controller action
    hoverOn: 'hoverOn', // this is needed to bubble this action to the respective controller action
    hoverOff: 'hoverOff', // this is needed to bubble this action to the respective controller action
    _isExpanded: false,
    isExpanded: Ember.computed('root.isExpanded', 'isWorkspace', '_isExpanded', function () {
        if (!this.get('isWorkspace')) {
            return this.get('root.isExpanded');
        }
        return this.get('_isExpanded');
    }),
    actions: {
        // expose these actions (bubble them up to the controller)
        createRelation: function (parent, options) {
            this.sendAction('createRelation', parent, options);
        },
        createRelation: function (parent, options, root) {
            this.sendAction('createRelation', parent, options, root);
        },
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
        },
        // regular actions (don't bubble up)
        toggleExpanded: function () {
            if (!this.get('isWorkspace')) {
                this.get('root').toggleProperty('isExpanded');
                if (!this.get('root.isExpanded')) {
                    this.set('currentHover', false);
                }
            } else {
                this.toggleProperty('_isExpanded');
                if (!this.get('_isExpanded')) {
                    this.set('currentHover', false);
                }
            }
        },
        expand: function () {
            if (!this.get('isWorkspace')) {
                this.set('root.isExpanded', true);
            } else {
                this.set('_isExpanded', true);
            }
        },
    }
});
