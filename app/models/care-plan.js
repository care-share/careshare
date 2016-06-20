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

import model from 'ember-fhir-adapter/models/care-plan';
import Ember from 'ember';
import DS from 'ember-data';
import commProps from 'careshare/properties/comm-properties';

export default model.extend({
    displayText: Ember.computed(function () {
        let value = this.get('addresses.firstObject.display');
        if (value) {
            return `Care Plan for ${value}`;
        }
        let id = this.get('id');
        return `Care Plan ${id}`;
    }),
    hasNominations: DS.attr('boolean'),
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount
});
