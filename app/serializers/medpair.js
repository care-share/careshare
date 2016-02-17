import base from 'careshare/serializers/careauth/base';

// we don't inherit from the Ember FHIR Adapter application serializer
export default base.extend({
    attrs: {
        homeMed: {embedded: 'always'},
        ehrMed: {embedded: 'always'},
        discrepancy: {embedded: 'always'}
    }
});
