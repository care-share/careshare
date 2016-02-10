import base from 'careshare/serializers/careauth/base';

// we don't inherit from the Ember FHIR Adapter application serializer
export default base.extend({
    normalizeResponse: function (store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, {'medpair': payload.data}, id, requestType);
    },
    attrs: {
        homeMed: {embedded: 'always'},
        ehrMed: {embedded: 'always'},
        discrepancy: {embedded: 'always'}
    }
});
