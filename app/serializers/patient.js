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

import Patient from 'ember-fhir-adapter/serializers/patient';

let PatientSerializer = Patient.extend({
    attrs: {
        name: {embedded: 'always'}
    },
    normalize: function (type, hash, prop) {
        let queryParam = `?patient:Patient=${hash.id}`;
        (hash.content || hash)['links'] = {
            carePlans: `/CarePlan${queryParam}`,
            conditions: `/Condition${queryParam}`,
            nutrition: `/Nutrition${queryParam}`,
            encounters: `/Encounter${queryParam}`,
            medications: `/MedicationStatement${queryParam}`,
            appointments: `/Appointment${queryParam}`,
            risks: `/RiskAssessment?subject:Patient=${hash.id}`
        };
        return this._super(type, hash, prop);
    }
});

export default PatientSerializer;
