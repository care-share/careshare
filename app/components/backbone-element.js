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

export default Ember.Component.extend({
    // args passed in from template: parent, name
    tagName: 'span', // needed for Ember to build this in a HTML span element instead of a div
    classNames: ['backbone-element'], // needed for Ember to add this CSS class to the HTML element
    // action dictionary/map:
    updateRecord: 'updateRecord', // this is needed to bubble this action to the respective controller action
    updateArraySingle: 'updateArraySingle', // this is needed to bubble this action to the respective controller action
    isArray: false, // is this used for a single object or an array of objects?
    setup: function () {
        console.log('[INIT] (backbone-element) - record: ' + this.get('parent') + ', name: ' + this.get('name') + ', type: ' + this.get('type'));
        var action = 'updateRecord'; // by default, the attribute is a single object
        if (this.get('isArray')) {
            // the attribute is an array of objects
            action = 'updateArraySingle';
        }
        // causes the controller to create a backbone element ('type') object for this attribute ('name')
        this.sendAction(action, this.get('parent'), this.get('name'), this.get('type'));
        // TODO: perhaps ditch 'parent' and 'name' in favor of an 'attribute' that is directly tied to parent.name?
    }.on('init')
});
