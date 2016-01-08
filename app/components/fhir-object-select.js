import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    classNames: ['fhir-object-select'],
    //  compSelection: function() {
    //  	return this.get('parent').get(this.get('localVariable'));
    // }.property('parent', 'localVariable'),
    setup: function () {
    }.on('init'),
    actions: {
        changed: function (input) {
            var attr = this.get('variable');
            var target;
            var relatedListName = `rl${this.get('parent')._internalModel.modelName.camelize().capitalize().pluralize()}`;
            var relatedList;
            var targetRef = this.get(`parent.${attr}.content`);
            if (targetRef) {
                // an existing reference is present; delete the target's local reference to our parent object
                var split = targetRef.get('reference').split('/');
                target = this.get('parent').store.peekRecord(split[0], split[1]);
                relatedList = target.get(relatedListName);
                if (relatedList) {
                    relatedList.removeObject(this.get('parent'));
                }
            }
            if (input === 'none') {
                this.get('parent').set(attr, undefined);
            } else {
                var reference = this.get('parent').store.createRecord('reference', {
                    reference: input
                });

                console.log(reference);
                this.get('parent').set(attr, reference);
                var inputsplit = input.split('/');
                this.get('parent').set(this.get('localVariable'), this.get('parent').store.peekRecord(inputsplit[0], inputsplit[1]));

                // add a local reference from the target to our parent object
                target = this.get('parent').store.peekRecord(inputsplit[0], inputsplit[1]);
                relatedList = target.get(relatedListName);
                if (relatedList) {
                    relatedList.addObject(this.get('parent'));
                } else {
                    target.set(relatedListName, [this.get('parent')]);
                }
                // TODO: save the parent when we add a relation???
            }
        }
    }
});