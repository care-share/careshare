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

export default Ember.Component.extend({
    createMessage: 'createMessage',
    destroyMessage: 'destroyMessage',
    nameID: null,
    textAreaValue: '',
    setup: function () {
        this.set('nameID', Math.random());
        // as soon as the user views the expanded resource (and the comm-channel is initialized), mark all messages seen
        var comms = this.get('resource.comms');
        comms.forEach(function (item) {
            if (!item.get('hasSeen')) {
                item.set('hasSeen', true);
                item.save();
            }
        });
    }.on('init'),
    actions: {
        createMessage: function (message) {
            console.log("COMM CHANNEL createMessage: " + message);
            this.sendAction('createMessage', message, this.get('resource.id'), this.get('resource_type'));
            this.set('textAreaValue', '');
        },
        destroyMessage: function (message) {
            console.log("COMM CHANNEL destroyMessage: " + message);
            message.destroyRecord();
        }
    }
});
