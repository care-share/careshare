import model from 'ember-fhir-adapter/models/nutrition-order';
import DS from 'ember-data';

export default model.extend({
    carePlanId: DS.attr('string') // only passed from client -> server (so this attribute is not in the serializer)
});
