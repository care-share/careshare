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

export default Ember.TextArea.extend({
    createMessage: 'createMessage',
    didRender() {
        var that = this;
        // the render gets triggered when this component first shows, and when actions are taken
        // we need to unbind jquery events before binding new ones to prevent duplicate actions
        this.$().off('keypress').keypress(function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
            }
        });
        this.$().off('focusout').focusout(function () {
            that.sendAction('createMessage', this.value);
        });
    }
});
