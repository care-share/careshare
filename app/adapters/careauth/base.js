import DS from 'ember-data';
import Ember from 'ember';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    host: window.Careshare.apiUrl,
    authorizer: 'authorizer:custom' // this, with the DataAdapterMixin, automatically adds authorization headers
});
