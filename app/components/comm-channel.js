import Ember from 'ember';

export default Ember.Component.extend({
    createMessage: 'createMessage',
    destroyMessage: 'destroyMessage',
    nameID: null,
    textAreaValue: '',
    setup: function () {
        this.set('nameID', Math.random());
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
