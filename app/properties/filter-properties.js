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

// used to add filter attributes to a model

export default {
    err: function (name, sortKey) {
        if (!sortKey) {
            sortKey = 'id';
        }
        return Ember.computed(`${name}.@each.isDeleted`, `${name}.@each.isError`, function () {
            return this.get(name).filter(function (item) {
                return !item.get('isDeleted') && !item.get('isError');
            }).sortBy(sortKey);
        });
    },
    err1: function (name) {
        // same as above, but for a single model instead of an array
        return Ember.computed(`${name}.isError`, `${name}.isDeleted`, function() {
            let reason = this.get(name);
            if (reason && !reason.get('isError') && !reason.get('isDeleted')) {
                return reason;
            }
            return null;
        });
    }
};
