import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

// actions are defined at: http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-ApplicationRouteMixin
export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    sessionAuthenticationSucceeded: function() {
    },
    sessionAuthenticationFailed: function(error) {
      //this.controllerFor('application').set('loginErrorMessage', error.message);
      alert('Error: ' + error.status + ', ' + error.message);
    }
  }
});

