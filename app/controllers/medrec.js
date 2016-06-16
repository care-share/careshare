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

export default Ember.ObjectController.extend({
    showEnforceVA: true,
    showAcceptHH: true,
    showClarify: true,
    showRenew: true,
    showDoNotUse: true,
    filteredContent: function () {
        // TODO: fix this, it doesn't recompute the property when actions are changed
        // problem is, we can change actions two ways: click on text, or click on radio button
        // radio button doesn't allow us to specify an action that bubbles up
        var filters = [];
        if (this.get('showEnforceVA')) {
            filters.addObject('Enforce VA');
        }
        if (this.get('showAcceptHH')) {
            filters.addObject('Accept HH');
        }
        if (this.get('showClarify')) {
            filters.addObject('Clarify');
        }
        if (this.get('showRenew')) {
            filters.addObject('Renew');
        }
        if (this.get('showDoNotUse')) {
            filters.addObject('Do not use');
        }
        return this.get('model').filter(function (item) {
            return filters.contains(item.get('homeMed.action'));
        }, this);
    }.property('showEnforceVA', 'showAcceptHH', 'showClarify', 'showRenew', 'showDoNotUse'),
    actions: {
        setAction: function (medPair, action) {
            medPair.set('homeMed.action', action);
        },
        submitForm: function () {
            // first, clear all error/success messages
            this.clearMessages();

            // validate signature and form entries
            if (this.validateEntries() && this.validateSignature()) {
                // everything is valid, try to save all of the medentry
                this.saveEntries();
            }
        }
    },
    clearMessages() {
        this.set('errorMessage', '');
        this.set('successMessage', '');
    },
    validateEntries() {
        // only return true if every MedEntry has an action selected
        var medPairs = this.get('model').toArray();
        if (medPairs.length === 0) {
            this.set('errorMessage', 'There are no entries to submit!');
            return false;
        }
        for (var i = 0; i < medPairs.length; i++) {
            if (Ember.isEmpty(medPairs[i].get('homeMed.action'))) {
                this.set('errorMessage', 'You must first select an action for all entries!');
                return false;
            }
        }
        return true;
    },
    validateSignature() {
        // only return true if the user has entered a signature
        var value = this.get('signatureText');
        if (Ember.isEmpty(value)) {
            this.set('errorMessage', 'You must first enter your signature!');
            return false;
        }
        return true;
    },
    saveEntries() {
        // prevent user from hitting submit more than once
        this.set('disableSubmit', true);
        // loop through medpairs, save them all, and create success message
        var medPairs = this.get('model').toArray();
        var promises = [];
        for (var i = 0; i < medPairs.length; i++) {
            var medEntry = medPairs[i].get('homeMed.content');
            var promise = medEntry.save();
            promises.pushObject(promise);
        }
        // try to save all models, and if any of them fail, throw an error
        var that = this;
        Ember.RSVP.all(promises).then(function(){
            that.set('successMessage', 'Form submitted successfully!');
        }, function(error) {
            that.set('errorMessage', 'Form submission failed! ' + error.message);
        }).then(function () {
            that.set('disableSubmit', false);
        });
    }
});
