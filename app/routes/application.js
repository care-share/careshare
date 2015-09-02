import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

// actions are defined at: http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-ApplicationRouteMixin
export default Ember.Route.extend(ApplicationRouteMixin, {
  setupController: function(controller){
      console.log('is_openid: '+window.Careshare.is_openid);
      if(window.Careshare.is_openid){
        controller.set('signInType','signin-openid');
        controller.set('showOpenID',true);
      }
      else{
        controller.set('signInType','signin');
        controller.set('showOpenID',false);
      }
  },
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
    sessionAuthenticationFailed: function(error) {
      this.controllerFor('application').set('lastLoginFailed',true);
      //this.controllerFor('application').set('loginErrorMessage', error.message);
      var errorMessage = 'An unknown error occurred.';
      var errorType = 'alert-danger';
      console.log('Error: ' + error.status + ', ' + error.message);
      if(error.status === 'Unauthorized'){
        errorMessage = 'Invalid credentials.';
        errorType = 'alert-warning';
      }
      else if(error.status === 'Forbidden'){
        errorMessage = 'Your account has not yet been approved.';
        errorType = 'alert-info';
      }
      this.controllerFor('application').set('errorMessage',errorMessage);
      this.controllerFor('application').set('errorType',errorType);
    }
  }
});

