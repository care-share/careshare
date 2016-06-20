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
import FHIRAdapter from 'ember-fhir-adapter/adapters/application';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default FHIRAdapter.extend(DataAdapterMixin, {
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    host: window.Careshare.fhirUrl,
    authorizer: 'authorizer:custom', // this, with the DataAdapterMixin, automatically adds authorization headers
    buildURL: function (modelName, id, snapshot, requestType, query) {
        if (requestType === 'query' && query) {
            // if we're trying to find multiple records, make sure we are getting 50 at a time and we are getting JSON
            query['_format'] = 'json';
            if (!query['_count']) {
                query['_count'] = 50;
            }
        }
        return this._super(modelName, id, snapshot, requestType, query);
    }
});
