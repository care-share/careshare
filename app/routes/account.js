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

import base from 'careshare/routes/base';
import API from '../api';

export default base.extend({
    setupController: function (controller) {
        API.roles(this.get('session.data.authenticated'), controller);
        API.unapproved(this.get('session.data.authenticated'), controller);
        API.approved(this.get('session.data.authenticated'), controller);
    },
    actions: {
        reset: function (controller) {
            API.unapproved(this.get('session.data.authenticated'), controller);
            API.approved(this.get('session.data.authenticated'), controller);
        },
        approve: function (id, session, controller) {
            console.log('approve(route) called');
            API.approve(id, session, controller);
        },
        deny: function (id, session, controller) {
            console.log('deny(route) called');
            API.deny(id, session, controller);
        },
        addRole: function (id, role, session, controller) {
            console.log('add role(route) called');
            API.addRole(id, role, session, controller);
        },
        removeRole: function (id, role, session, controller) {
            console.log('remove role(route) called');
            API.removeRole(id, role, session, controller);
        }
    }
});
