import serializer from 'ember-fhir-adapter/serializers/nutrition-order';

export default serializer.extend({
    attrs: {
        nominations: {embedded: 'always'},
        isExpanded: {serialize: false}
    }
});
