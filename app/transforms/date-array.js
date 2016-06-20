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

import DS from 'ember-data';
import Ember from 'ember';

// adapted from:
// http://stackoverflow.com/questions/12168570/how-to-represent-arrays-within-ember-data-models
// https://github.com/emberjs/data/blob/v2.3.0/addon/-private/transforms/date.js
export default DS.DateTransform.extend({
    deserialize: function (serialized) {
        var result = [];
        if (Ember.typeOf(serialized) === 'array') {
            result = serialized.map(function (item/*, index, enumerable*/) {
                // deserialize each array element as a Date
                return this._super(item);
            }, this).filter(filterInvalid);
        }
        return result;
    },
    serialize: function (deserialized) {
        var result = [];
        if (Ember.typeOf(deserialized) === 'array') {
            result = deserialized.map(function (item/*, index, enumerable*/) {
                // serialize each array element as a String
                return this._super(item);
            }, this).filter(filterInvalid);
        }
        return result;
    }
});

function filterInvalid(item/*, index, enumerable*/) {
    // filter out any invalid elements
    return item !== null;
}
