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
import Base from 'ember-simple-auth/authenticators/base';
import API from '../api';
import JWT from 'npm:jsonwebtoken';

export default Base.extend({
    restore(data) {
        console.log('restore(data): ' + JSON.stringify(data));
        var decoded = JWT.decode(data.token);
        if (decoded.exp < (new Date().getTime() / 1000)) {
            return Ember.RSVP.reject(data);
        }
        return Ember.RSVP.resolve(data);
    },
    authenticate(data) {
        if (data != null && data['code'] != null) {
            console.log('authenticate(openidconnect)');
            return API.openidlogin(data['code']);
        }
        console.log('authenticate(data): ' + JSON.stringify(data));
        //alert('AUTHENTICATE called!');
        return API.login(data.identification, data.password);
    },
    invalidate(data) {
        console.log('invalidate(data): ' + JSON.stringify(data));
        //alert('INVALIDATE called!');
        return API.logout(data);
    }
});
