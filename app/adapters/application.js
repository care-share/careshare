import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    pathForType: function (type) {
        return Ember.String.capitalize(Ember.String.camelize(type));
    },
    buildURL: function (modelName, id, snapshot, requestType, query) {
        if (requestType === 'query' && query) {
            // if we're trying to find multiple records, make sure we are getting 50 at a time and we are getting JSON
            query['_format'] = 'json';
            if (!query['_count']) {
                query['_count'] = 50;
            }
        }
        return this._super(modelName, id, snapshot, requestType, query);
    },
    // TODO: remove this temporary fix, it will be integrated into the FHIR adapter soon
    createRecord: function (store, type, snapshot) {
        if (snapshot.id) {
            // if we have set an ID on this record, use "update" instead of "create"
            // (triggers a PUT instead of POST)
            return this.updateRecord(store, type, snapshot);
        }
        return this._super(store, type, snapshot);
    }
});
