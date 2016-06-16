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

export default DS.Model.extend({
    _id: DS.attr('string'),
    medication_order_id: DS.attr('string'),
    name: DS.attr('string'),
    dose: DS.attr('string'),
    freq: DS.attr('string'),
    note: DS.attr('string'),
    not_found: DS.attr('boolean'),
    compliance_bool: DS.attr('boolean'),
    noncompliance_note: DS.attr('string'), // goes with compliance_bool:false
    med_bool: DS.attr('boolean'), // ridiculously named variable -- true means this came from the primary care org, false means it's an outside prescriber
    prescribed_by_primary: Ember.computed.alias('med_bool'), // so let's use another name for it 
    prescriber_note: DS.attr('string'), // goes with med_bool/prescribed_by_primary:false
    // added by user in Ember template
    action: DS.attr('string'),
    hhNotes: DS.attr('string'),
    vaNotes: DS.attr('string'),
    actionNeedsSignature: Ember.computed('action', function () {
        switch (this.get('action')) {
            case 'Accept HH':
            case 'Renew':
            case 'Enforce VA':
            case 'Do not use':
            case 'Clarify':
                return true;
            default:
            case 'No action':
                return false;
        }
    })
});
