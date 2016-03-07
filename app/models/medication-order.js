import model from 'ember-fhir-adapter/models/medication-order';
import commProps from 'careshare/properties/comm-properties';

export default model.extend({
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount
});
