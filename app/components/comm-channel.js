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
