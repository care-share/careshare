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

import CarePlanResource from 'careshare/controllers/careplan/resource';
import filter from 'careshare/properties/filter-properties';
import Ember from 'ember';

export default CarePlanResource.extend({
    session: Ember.inject.service('session'),
    needs: 'careplan',
    careplan: Ember.computed.alias('controllers.careplan'),
    _resources: [],
    resources: filter.err('_resources', false), // filter out deleted records
    isFull: Ember.computed('resources.[]', function() {
        // This is not working -- this.get('resources').length always returns 0. why???
        return (this.get('resources').length >= 3);
    }),
    actions: {
        removeFromWorkspace: function(objectToRemove) {
            console.log('workspace#removeFromWorkspace');
            this.get('_resources').removeObject(objectToRemove);
        },
        addToWorkspace: function (draggedObject/*, options*/) {
            this.get('_resources').addObject(draggedObject);
        },
        hoverOn: function (model) {
            this.get('careplan').send('hoverOn', model);

        },
        hoverOff: function (/*model*/) {
            this.get('careplan').send('hoverOff');
        }
    }
});
