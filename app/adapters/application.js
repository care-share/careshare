import Ember from 'ember';
import DS from 'ember-data';

let ApplicationAdapter = DS.RESTAdapter.extend({
  pathForType: function(type){
    return Ember.String.capitalize(Ember.String.camelize(type));
  },
  buildURL: function(modelName, id, snapshot, requestType, query) {
    if (requestType === "query" && query) {
      // if we're trying to find multiple records, make sure we are getting 50 at a time and we are getting JSON
      query['_format'] = 'json';
      if (!query['_count'])
        query['_count'] = 50;
    }
    return this._super(modelName, id, snapshot, requestType, query);
  }
});

export default ApplicationAdapter;
