import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

// actions are defined at: http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-ApplicationRouteMixin
export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    queryParamsDidChange: function(params){
        if(params != null && params['code'] != null){
          console.log("ACCESS CODE = "+params['code']);
          this.controllerFor('application').send('openidlogin',params);
        }
      },
    sessionAuthenticationSucceeded: function() {
      this.controllerFor('application').set('lastLoginFailed',false);
    },
    sessionAuthenticationFailed: function() {
      this.controllerFor('application').set('lastLoginFailed',true);
      //this.controllerFor('application').set('loginErrorMessage', error.message);
     // alert('Error: ' + error.status + ', ' + error.message);
    }
  }
});

