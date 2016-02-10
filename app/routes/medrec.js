import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    model: function (params) {
        return this.store.query('medpair', {patient_id: params.patient_id});
    },
    actions: {}
});
