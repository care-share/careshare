import DS from 'ember-data';
import Ember from 'ember';

// we don't inherit from the Ember FHIR Adapter application serializer
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    isNewSerializerAPI: true, // inform Ember Data that we want to use the new Serializer API
    normalizeResponse: function (store, primaryModelClass, payload, id, requestType) {
        // if this is the 'top level' response from the CareAuth API, our payload is in the 'data' attribute of the body
        var hash = payload;
        if (payload.code && payload.message && payload.data) {
            hash = {};
            hash[primaryModelClass.modelName] = payload.data;
        }
        return this._super(store, primaryModelClass, hash, id, requestType);
    },
    extractId: function (modelClass, resourceHash) {
        // auto-generate a unique ID for each model
        return resourceHash._id || Ember.generateGuid({}, modelClass.modelName);
    }
});
