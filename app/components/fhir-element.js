import Ember from 'ember';

// this is the top-level FHIR component and contains other components
// (e.g. each Goal is wrapped in a single fhir-element)
export default Ember.Component.extend({
    // args passed in from template: root, type
    classNames: ['fhir-element'], // needed for Ember to add this CSS class to the HTML element
    expanded: false,
    currentHover: false,
    // action dictionary/map:
    updateRecord: 'updateRecord', // this is needed to bubble this action to the respective controller action
    undoRecord: 'undoRecord', // this is needed to bubble this action to the respective controller action
    deleteRecord: 'deleteRecord', // this is needed to bubble this action to the respective controller action
    saveRecord: 'saveRecord', // this is needed to bubble this action to the respective controller action
    isCreateNomination: false,
    isDeleteNomination: false,
    isChangeNomination: false,
    setup: function () {
        if (this.get('parent')) {
            console.log('[INIT] (FHIR-ELEMENT) {record: ' +
                this.get('parent') + ',name: ' + this.get('name') + ',type: ' + this.get('type'));
            this.sendAction('updateRecord', this.get('parent'), this.get('name'), this.get('type'));
        } else if (this.get('root.isNewRecord')) {
            // newly created records start out expanded
            this.set('expanded', true);
        }
        if (this.get('root.isRelatedToCarePlan') === true) {
            this.get('classNames').addObject('is-related-to-care-plan');
        }
        else if (this.get('root.isRelatedToCarePlan') === false ){
            this.get('classNames').addObject('not-related-to-care-plan');
        }
        var root = this.get('root');
        //&& (this.get('root.nominations').length >= 1)
        if (this.get('root') && this.get('root.nominations')){
            var noms = this.get('root.nominations');
            if (noms.length === 1){
                if (noms[0].action === "create"){
                    this.set('isCreateNomination', true);
                }
                else if (noms[0].action === "delete"){
                    this.set('isDeleteNomination', true);
                }
                else{
                    this.set('isChangeNomination', true);
                }
            }
            else if(noms.length > 1){
                this.set('isChangeNomination', true);
            }
        }
    }.on('init'),
    actions: {
        updateArray: function (parent, name, type) {
            console.log('(FHIR-ELEMENT) UPDATE ARRAY - record: ' + parent + ',name: ' + name + ',type: ' + type);
            this.sendAction('updateArray', parent, name, type);
        },
        updateRecord: function (parent, name, type) {
            console.log('(FHIR-ELEMENT) UPDATE RECORD - record: ' + parent + ',name: ' + name + ',type: ' + type);
            this.sendAction('updateRecord', parent, name, type);
        },
        undoRecord: function () {
            console.log('(FHIR-ELEMENT) UNDO RECORD - record: ' + this.get('root'));
            this.sendAction('undoRecord', this.get('root'));
        },
        deleteRecord: function () {
            console.log('(FHIR-ELEMENT) DELETE RECORD - record: ' + this.get('root'));
            this.sendAction('deleteRecord', this.get('root'));
        },
        removeItem: function (index) {
            console.log('(FHIR-ELEMENT) REMOVE ARRAY ITEM - parent: ' + this.get('parent') + ',index: ' + index);
            this.sendAction('removeItem', this.get('parent'), index);
        },
        saveRecord: function () {
            console.log('(FHIR-ELEMENT) SAVE RECORD - record: ' + this.get('root'));
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
            if (this.get('expanded') === false) {
                this.set('currentHover', false);
            }
        },
        expand: function () {
            this.set('expanded', true);
        },
        acceptDeletion: function(){
            console.log('(FHIR-ELEMENT) ACCEPT HH DELETE RECORD - record: ' + this.get('root'));
            var nomId = this.get('root.nominations')[0].id;
            this.set('root.acceptedNominations', [nomId]);
            this.sendAction('deleteRecord', this.get('root'));
        },
        rejectDeletion: function(){
            console.log('(FHIR-ELEMENT) Reject HH DELETE RECORD - record: ' + this.get('root'));
            var nomId = this.get('root.nominations')[0].id;
            this.set('root.rejectedNominations', [nomId]);
            this.sendAction('saveRecord', this.get('root'));
        }
    }
});
