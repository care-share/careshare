import DS from 'ember-data';
import Ember from 'ember';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    host: window.Careshare.apiUrl,
    authorizer: 'authorizer:custom', // this, with the DataAdapterMixin, automatically adds authorization headers
    pathForType: function(/*type*/) {
        // this adapter only supports the 'query' method, where the argument is {patientId: 'foo'}
        return 'medrecs';
    },
    urlForQuery(query, modelName) {
        // instead of doing urls like '/url?patient_id=foo', we want to do it like '/url/patient_id/foo'
        var url = this._super(query, modelName);
        if (query.patient_id) {
            url += '/patient_id/' + query.patient_id;
            // delete the patient_id attribute from the query object
            // (otherwise the URL will have '?patient_id=foo' tacked onto the end of it)
            delete query.patient_id;
        }
        return url;
    }
});
