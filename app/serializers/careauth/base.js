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

// we don't inherit from the Ember FHIR Adapter application serializer
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    isNewSerializerAPI: true, // inform Ember Data that we want to use the new Serializer API
    normalizeResponse: function (store, primaryModelClass, payload, id, requestType) {
        // if this is the 'top level' response from the CareAuth API, our payload is in the 'data' attribute of the body
        var hash = payload;
        if (payload.code && payload.message && payload.data) {
            hash = {};
            hash[primaryModelClass.modelName] = payload.data;
        }
        return this._super(store, primaryModelClass, hash, id, requestType);
    },
    extractId: function (modelClass, resourceHash) {
        // auto-generate a unique ID for each model
        return resourceHash._id || Ember.generateGuid({}, modelClass.modelName);
    }
});
