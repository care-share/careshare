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
    patcher: new diff_match_patch(),
    nameID: '',
    passthroughInit: function () {
        console.log('Passthrough INIT: parent= ' + this.get('parent'));
        this.set('nameID', this.get('name') + new Date().valueOf() + Math.random());
        //Get a string representation of the ORIGINAL property
        var sanitizedValue = this.get('parent').get(this.get('name')) ? this.get('parent').get(this.get('name')) : '';
        this.set('originalValue', sanitizedValue);

        // Does not work even though it returns the computed property and not the evaluation
        // this.set('passthrough', this.get('parent')[this.get('name')])

        //Creates a computed property that acts as a pass though from inner component to actual parent model
        Ember.defineProperty(this, 'passthrough', Ember.computed(function (key, value) {
            // Set parent variable when passthrough is edited externally
            if (arguments.length > 1) {
                console.log('(passthrough-component) parent: ' + this.get('parent') + ',name: ' + this.get('name') + ',parent.name: ' + this.get('parent').get('repeat'));
                let result = this.get('parent.' + this.get('name'));
                if ((result === null || result === undefined) && (value === null || value === undefined)) {
                    // this is a newly created record, if we set the value it will trigger to appear as 'dirty'
                } else {
                    this.get('parent').set(this.get('name'), value);
                }
            }
            // Sets passthrough to this when property changes
            return this.get('parent.' + this.get('name'));
        }).property('parent.' + this.get('name')));


    }.on('init')
});
