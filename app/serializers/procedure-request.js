import serializer from 'ember-fhir-adapter/serializers/procedure-request';

export default serializer.extend({
    attrs: {
        nominations: {embedded: 'always'},
        isExpanded: {serialize: false}
    }
});
