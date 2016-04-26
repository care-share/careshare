import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    classNames: ['fhir-object-select'],
    setup: function () {
    }.on('init'),
    actions: {
        changed: function (input) {
            var attr = this.get('variable');
            if (input === 'none') {
                this.get('parent').set(attr, undefined);
            } else {
                var reference = this.get('parent').store.createRecord('reference', {
                    reference: input
                });
                this.get('parent').set(attr, reference);
            }
        }
    }
});