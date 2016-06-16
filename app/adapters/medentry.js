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

import base from 'careshare/adapters/careauth/base';

export default base.extend({
    pathForType: function (/*type*/) {
        // this adapter only supports the 'update' method
        return 'medentries';
    },
    urlForQuery(query, modelName) {
        // instead of doing urls like '/url?patient_id=foo', we want to do it like '/url/patient_id/foo'
        var url = this._super(query, modelName);
        if (query.patient_id) {
            url += '/patient_id/' + query.patient_id;
            // delete the patient_id attribute from the query object
            // (otherwise the URL will have '?patient_id=foo' tacked onto the end of it)
            delete query.patient_id;
        }
        return url;
    }
});
