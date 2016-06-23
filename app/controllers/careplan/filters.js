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

export default Ember.Controller.extend({
    patient: Ember.inject.controller('careplan'),
    expandGoals: false,
    expandProblems: false,
    expandNutrition: false,
    expandInterventions: false,
    expandMedications: false,
    expandParticipants: false,
    actions: {
        toggleExpandProblems: function () {
            this.toggleProperty('expandProblems');
        },
        toggleExpandGoals: function () {
            this.toggleProperty('expandGoals');
        },
        toggleExpandInterventions: function () {
            this.toggleProperty('expandInterventions');
        },
        toggleExpandNutrition: function () {
            this.toggleProperty('expandNutrition');
        },
        toggleExpandMedications: function () {
            this.toggleProperty('expandMedications');
        },
        toggleExpandParticipants: function () {
            this.toggleProperty('expandParticipants');
        }
    }
});
