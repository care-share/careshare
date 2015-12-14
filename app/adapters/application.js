import Ember from 'ember';
import FHIRAdapter from 'ember-fhir-adapter/adapters/application';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default FHIRAdapter.extend(DataAdapterMixin, {
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    host: window.Careshare.fhirUrl,
    authorizer: 'authorizer:custom', // this, with the DataAdapterMixin, automatically adds authorization headers
    buildURL: function (modelName, id, snapshot, requestType, query) {
        if (requestType === 'query' && query) {
            // if we're trying to find multiple records, make sure we are getting 50 at a time and we are getting JSON
            query['_format'] = 'json';
            if (!query['_count']) {
                query['_count'] = 50;
            }
        }
        return this._super(modelName, id, snapshot, requestType, query);
    }
});
