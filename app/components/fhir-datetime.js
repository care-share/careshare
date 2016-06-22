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
import PassthroughComponent from 'careshare/components/passthrough-component';

export default PassthroughComponent.extend({
    patcher: new diff_match_patch(),
    classNames: ['fhir-datetime'],
    showModal: false,
    originalValue: '',
    isArray: false, // is this used for a single object or an array of objects?
    
    setup: function () {
        // Creates a computed property that converts date strings to Date objects
        Ember.defineProperty(this, 'datePassthrough', Ember.computed({
            // this.array is a boolean that determines if this is component modifies a regular attribute, or an array attribute that will contain a single datetime
            get(/*key*/) {
                var result;
                var passthrough = this.get('passthrough');
                if (this.get('isArray')) {
                    if (passthrough && passthrough.length > 0) {
                        result = passthrough[0];
                    }
                } else {
                    result = passthrough;
                }
                console.log('datePassthrough get result: ' + result);
                if (result === null || result === undefined || result === "") {
                    return result;
                }
                var dateFormat = this.get('showTime') ? 'MM/DD/YYYY hh:mm A' : 'MM/DD/YYYY'
                return moment(result).format(dateFormat);
            },
            set(key, value) {
                var result = new Date(Ember.Date.parse(value));
                console.log('datePassthrough set value: ' + value + ',result: ' + result);
                this.set('passthrough', this.get('isArray') ? [result] : result);
                return moment(result).format('MM/DD/YYYY hh:mm A');
            }
        }).property('passthrough'));

        //Get a string representation of the ORIGINAL property
        var attr = this.get('parent').get(this.get('name'));
        var sanitizedValue = attr ? attr : '';
        this.set('originalValue', sanitizedValue);

        //Define computed property in setup because the attribute name has to be set dynamically
        Ember.defineProperty(this, 'calculatedPatch', Ember.computed(function () {
            //Get a string representation of the CURRENT property
            var attr = this.get('parent').get(this.get('name'));
            var sanitizedValue = attr ? attr : '';

            // If there is a difference between the original and current create the Diff
            if (this.get('originalValue') !== sanitizedValue) {
                var diff = this.get('patcher').diff_main(
                    new Date(Ember.Date.parse(this.get('originalValue'))).toString(),
                    new Date(Ember.Date.parse(sanitizedValue)).toString(),
                    true
                );
                if (diff.toString().indexOf('Invalid Date') === -1) {
                    return this.get('patcher').diff_prettyHtml(diff);
                }
            }
            //If not return empty (Handlebars checks for empty string before creating DIV)
            return "";
        }).property('parent.' + this.get('name')));
    }.on('init'),
    actions: {
        'on-hide': function (modal) {
            // for some reason, auto-focus isn't working correctly;
            // when the modal pops up, focus does not change to the datetime input text box
            // if the user never clicked the box, then the datetime selection does not get applied to our datePassthrough
            // so, when the modal is hidden, we manually apply the value to our datePassthrough
            let value = Ember.$(modal.element).find('.form-control')[0].value;
            if (value && value.length > 0) {
                this.set('datePassthrough', value);
            }
        }
    }
});
