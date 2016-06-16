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
    tagName: 'span',
    classNames: ['change-request'],
    session: Ember.inject.service('session'),
    patcher: new diff_match_patch(),
    setup: function () {
        let _old = this.get('cr').originalValue;
        let _new = this.get('cr').value;
        this.set('old', _old);
        this.set('new', _new);
        // compute change display HTML
        let format = this.get('format');
        if (format === 'reference') {
            // custom formatting for Reference type
            let parent = this.get('parent');
            _old = checkRef(_old, parent);
            _new = checkRef(_new, parent);
        } else if (format === 'datetime') {
            let f = 'MM/DD/YYYY hh:mm A';
            if (_old) {
                _old = moment(_old).format(f);
            }
            if (_new) {
                _new = moment(_new).format(f);
            }
        }
        let p = this.get('patcher');
        let diff = p.diff_main(_old, _new, true);
        p.diff_cleanupSemantic(diff); // expand diff to whole words
        this.set('change', p.diff_prettyHtml(diff));
    }.on('init'),
    isAccepted: Ember.computed('parent.acceptedNominations.[]', function() {
        let id = this.get('cr').id;
        return this.get('parent.acceptedNominations').contains(id);
    }),
    isRejected: Ember.computed('parent.rejectedNominations.[]', function() {
        let id = this.get('cr').id;
        return this.get('parent.rejectedNominations').contains(id);
    }),
    styleAccepted: Ember.computed('isAccepted', function() {
        let suffix = '';
        if (this.get('isAccepted')) {
            suffix = ' change-request-applied';
        }
        return Ember.String.htmlSafe(`glyphicon glyphicon-ok${suffix}`);
    }),
    styleRejected: Ember.computed('isRejected', function() {
        let suffix = '';
        if (this.get('isRejected')) {
            suffix = ' change-request-applied';
        }
        return Ember.String.htmlSafe(`glyphicon glyphicon-remove${suffix}`);
    }),
    actions: {
        accept: function () {
            //Set input value to accepted change's value
            this.get('parent').set(this.get('name'), this.get('new'));
            // add this nomination to the acceptedNominations array (so it gets removed on the server side)
            let id = this.get('cr').id;
            this.get('parent.acceptedNominations').addObject(id);
            this.get('parent.rejectedNominations').removeObject(id); // in case the user clicked reject first
            //TODO apply styling to selected choice
        },
        reject: function () {
            // add this nomination to the rejectedNominations array (so it gets removed on the server side)
            if (this.get('parent').get(this.get('name')) === this.get('new')) {
                // if this CR was accepted, change the value back
                this.get('parent').set(this.get('name'), this.get('old'));
            }
            let id = this.get('cr').id;
            this.get('parent.rejectedNominations').addObject(id);
            this.get('parent.acceptedNominations').removeObject(id); // in case the user clicked accept first
            //TODO apply styling to selected choice
        }
    }
});

function checkRef(attr, that) {
    if (attr === null ) {
        return '';
    }

    let split = attr.split('/');
    if (split[1]) {
        let reference = that.store.peekRecord(split[0], split[1]);
        if (reference) {
            return reference.get('displayText');
        }
    }
    return attr;
}