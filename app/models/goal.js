import model from 'ember-fhir-adapter/models/goal';
import DS from 'ember-data';
import nomChange from 'careshare/properties/nominations-change-property';

export default model.extend({
    carePlanId: DS.attr('string'), // only passed from client -> server (so this attribute is not in the serializer)
    nominations: DS.attr('array'),
    acceptedNominations: DS.attr('array'),
    rejectedNominations: DS.attr('array'),
    changes: nomChange()
});
