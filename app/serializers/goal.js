import serializer from 'ember-fhir-adapter/serializers/goal';

export default serializer.extend({
    attrs: {
        nominations: {embedded: 'always'}
    }
});
