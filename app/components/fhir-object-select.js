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
    tagName: 'span',
    classNames: ['fhir-object-select'],
    // action dictionary/map:
    updateRecord: 'updateRecord', // this is needed to bubble this action to the respective controller action
    setup: function () {
    }.on('init'),
    actions: {
        changed: function (input) {
            var attr = this.get('name');
            if (input === 'none') {
                this.get('parent').set(attr, undefined);
            } else {
                this.get('parent').set(attr, input);
            }
        },
        updateRecord: function (parent, name, type) {
            this.sendAction('updateRecord', parent, name, type);
        }
    }
});