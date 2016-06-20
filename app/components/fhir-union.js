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
    // args passed in from template: root, choices (JSON)
    classNames: ['fhir-union'], // needed for Ember to add this CSS class to the HTML element
    isTypeChosen: false,
    allChoices: [],
    myChoice: {name: 'none', type: 'None selected'},
    setup: function () {
        this.set('allChoices', JSON.parse(this.get('choices')));
        console.log('root: ' + this.get('root'));
        console.log('allChoices: ' + this.get('allChoices'));
        var parent = this.get('root');
        var me = this;
        var chosen = false;
        this.get('allChoices')
            .forEach(function (item) {
                console.log('Parent is: ' + parent + ' and choice is: ' + item.name);
                console.log('Field in parent is: ' + parent.get(item.name));
                if (!chosen && parent.get(item.name) !== null && parent.get(item.name) !== undefined) {
                    console.log('+++Match');
                    me.set('myChoice', item);
                    me.set('isTypeChosen', true);
                    chosen = true;
                } else if (!chosen) {
                    console.log('---No match');
                }
            });
    }.on("init"),
    actions: {
        setChoice: function (choice) {
            this.set('myChoice', choice);
            this.set('isTypeChosen', true);
            console.log('Type chosen: ' + this.get('myChoice'));
        }
    }
});
