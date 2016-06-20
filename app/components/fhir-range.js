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