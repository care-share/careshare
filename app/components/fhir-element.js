/*
 * Copyright 2016 The MITRE Corporation, All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Ember from 'ember';

// this is the top-level FHIR component and contains other components
// (e.g. each Goal is wrapped in a single fhir-element)
export default Ember.Component.extend({
    // args passed in from template: root, type
    classNames: ['fhir-element'], // needed for Ember to add this CSS class to the HTML element
    //currentHover: false,
    // action dictionary/map:
    updateRecord: 'updateRecord', // this is needed to bubble this action to the respective controller action
    undoRecord: 'undoRecord', // this is needed to bubble this action to the respective controller action
    deleteRecord: 'deleteRecord', // this is needed to bubble this action to the respective controller action
    saveRecord: 'saveRecord', // this is needed to bubble this action to the respective controller action
    toggleExpanded: 'toggleExpanded', // this is needed to bubble this action to the respective controller action
    expand: 'expand', // this is needed to bubble this action to the respective controller action
    isCreateNomination: false,
    isDeleteNomination: false,
    isChangeNomination: false,
    session: Ember.inject.service('session'),
    highlight: Ember.computed('toHighlight.[]', function() {
        return this.get('toHighlight').contains(this.get('root.id'));
    }),
    computedStyle: Ember.computed('highlight', 'root.currentHover', 'root.isUnclean', function() {
        let prefix = '';
        if (this.get('root.currentHover')) {
            prefix = 'border-color:#4bca93;';
        } else if (this.get('highlight')) {
            prefix = 'border-color:#4bca93;border-style: dashed;';
        }
        // if (this.get('root.isUnclean')) {
        //     prefix += 'background-color:lightskyblue;';
        // }
        return Ember.String.htmlSafe(prefix + 'max-width: 100%; overflow-x: hidden; overflow-y: hidden;');
    }),
    setup: function () {
        if (this.get('parent')) {
            console.log('[INIT] (FHIR-ELEMENT) {record: ' +
                this.get('parent') + ',name: ' + this.get('name') + ',type: ' + this.get('type'));
            this.sendAction('updateRecord', this.get('parent'), this.get('name'), this.get('type'));
        } else if (this.get('root.isNewRecord')) {
            // newly created records start out expanded
            this.get('root').set('isExpanded', true);
        }
        if (this.get('root.isRelatedToCarePlan') === true) {
            this.get('classNames').addObject('is-related-to-care-plan');
        }
        else if (this.get('root.isRelatedToCarePlan') === false) {
            this.get('classNames').addObject('not-related-to-care-plan');
        }
    }.on('init'),
    nominationsChanged: function () {
        var root = this.get('root');
        if (root) {
            var noms = this.get('root.nominations');
            this.set('isCreateNomination', false);
            this.set('isChangeNomination', false);
            this.set('isDeleteNomination', false);
            if ((noms && noms.length === 1 && noms[0].action === 'create')) {
                this.set('isCreateNomination', true);
            } else if (noms && noms.length === 1 && noms[0].action === 'delete') {
                this.set('isDeleteNomination', true);
            } else if (noms && noms.length >= 1) {
                this.set('isChangeNomination', true);
            }
        }
    }.observes('root.nominations', 'root.isNewRecord').on('init'),
    displayLetter: function(){
        var name = this.get('root._internalModel.modelName');
        if (name === 'condition'){
            return 'P';
        }
        else if (name === 'goal'){
            return 'G';
        }
        else if (name === 'procedure-request'){
            return 'I';
        }
        else if (name === 'medication-order'){
            return 'M';
        }
        else if (name === 'nutrition-order'){
            return 'N';
        }
        else {
            //This should never happen
            return this.get('root._internalModel.modelName.0');
        }
    }.property('root'),
    isNomination: function (){
        return  this.get('isCreateNomination') || this.get('isDeleteNomination') || this.get('isChangeNomination');
    }.property('isCreateNomination','isChangeNomination','isDeleteNomination'),
    isMyNomination: function (){
        return (this.get('session.data.authenticated._id') === this.get('root.nominations.firstObject.authorId'));
    }.property('root.nominations'),
    isAdmin: function (){
        return this.get('session.data.authenticated.isAdmin');
    }.property('session'),
    actions: {
        removeFromWorkspace: function(/*workspace*/) {
            console.log('fhir-element#removeFromWorkspace');
            // TODO: this action needs to trigger the action of the same name in the workspace controller
        },
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
            this.set('root.currentHover', true);
        },
        hoverOff: function () {
            this.set('root.currentHover', false);
        },
        toggleExpanded: function () {
            console.log('fhir-element#toggleExpanded');
            this.sendAction('toggleExpanded');
        },
        expand: function () {
            this.sendAction('expand');
        },
        acceptDeletion: function () {
            console.log('(FHIR-ELEMENT) ACCEPT HH DELETE RECORD - record: ' + this.get('root'));
            let nomId = this.get('root.nominations.firstObject.id');
            this.set('root.acceptedNominations', [nomId]);
            this.sendAction('deleteRecord', this.get('root'));
        },
        rejectDeletion: function () {
            console.log('(FHIR-ELEMENT) Reject HH DELETE RECORD - record: ' + this.get('root'));
            let nomId = this.get('root.nominations.firstObject.id');
            this.set('root.rejectedNominations', [nomId]);
            this.sendAction('saveRecord', this.get('root'));
        }
    }
});
