import DS from 'ember-data';
import Ember from 'ember';

// we don't inherit from the Ember FHIR Adapter application serializer
export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    isNewSerializerAPI: true, // inform Ember Data that we want to use the new Serializer API
    extractId: function (modelClass, resourceHash) {
        // auto-generate a unique ID for each model
        return resourceHash.id || Ember.generateGuid({}, modelClass.modelName);
    }
});
