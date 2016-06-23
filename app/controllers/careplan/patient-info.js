import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    patient: Ember.inject.controller('patient'),
    careplan: Ember.inject.controller('careplan'),
    address: Ember.computed.alias('patient.model.address.firstObject'),
    actions: {
        createMessage: function (message, resourceId, resourceType) {
            this.get('careplan').send('createMessage', message, resourceId, resourceType);
        }
    }
});
