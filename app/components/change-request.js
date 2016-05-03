import Ember from 'ember';
export default Ember.Component.extend({
    tagName: 'span',
    classNames: ['change-request'],
    session: Ember.inject.service('session'),
    patcher: new diff_match_patch(),
    change: function () {
        let p = this.get('patcher');
        let diff = p.diff_main(this.get('old'), this.get('new'), true);
        p.diff_cleanupSemantic(diff); // expand diff to whole words
        return this.get('patcher').diff_prettyHtml(diff);
    }.property('old', 'new'),
    setup: function () {
        this.set('old', this.get('cr').originalValue);
        this.set('new', this.get('cr').value);
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