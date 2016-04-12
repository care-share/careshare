import model from 'ember-fhir-adapter/models/care-plan';
import Ember from 'ember';
import DS from 'ember-data';
import commProps from 'careshare/properties/comm-properties';

export default model.extend({
    displayText: Ember.computed(function () {
        let value = this.get('addresses.firstObject.display');
        if (value) {
            return `Care Plan for ${value}`;
        }
        let id = this.get('id');
        return `Care Plan ${id}`;
    }),
    hasNominations: DS.attr('boolean'),
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount
});
