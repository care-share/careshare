import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    classNames: ['change-request'],
    session: Ember.inject.service('session'),
    patcher: new diff_match_patch(),
    setup: function () {
        this.set('old', this.get('cr').originalValue);
        this.set('new', this.get('cr').value);
        // compute change display HTML
        let format = this.get('format');
        let _old = this.get('old');
        let _new = this.get('new');
        if (format === 'reference') {
            // custom formatting for Reference type
            let parent = this.get('parent');
            _old = checkRef(_old, parent);
            _new = checkRef(_new, parent);
        } else if (format === 'datetime') {

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
    let split = attr.split('/');
    if (split[1]) {
        let reference = that.store.peekRecord(split[0], split[1]);
        if (reference) {
            return reference.get('displayText');
        }
    }
    return attr;
}