import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

// actions are defined at: http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-ApplicationRouteMixin
export default Ember.Route.extend(ApplicationRouteMixin, {
	renderTemplate: function(){
		var url = window.location.href;
		console.log('application route: renderTemplate');
		console.log('url: '+url);
		if(this.get('session.isAuthenticated')){		
			//if(url.indexOf('/patient/') > -1 || url.indexOf('careplan.') > -1){
			//	this.render('patient');
			//}
			//else{
				this.render('application');
			//}
		}else{
			this.render('login');
		}
	},
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
  	checkTemplate: function(){
		var url = window.location.href;
		console.log('application route: checkTemplate');
		console.log('url: '+url);
		if(this.get('session.isAuthenticated')){		
			if(url.indexOf('/patient/') > -1){
				this.render('patient');
			}
			else{
				this.render('careshare');
			}
		}else{
			this.render('login');
		}
	},
    queryParamsDidChange: function(params){
        if(params != null){
          console.log("params changed...");
          if(params['code'] != null){
            console.log("ACCESS CODE = "+params['code']);
            this.controllerFor('application').send('openidlogin',params);
          }
          else if(params['error'] != null){
            console.log("OPENID ERROR = "+params['error']);
            this.controllerFor('application').set('errorMessage','Cannot proceed without required permissions.');
            this.controllerFor('application').set('errorType','alert-warning');
            this.controllerFor('application').set('lastLoginFailed',true);
          }
		  this.send('checkTemplate');
        }
      },
    sessionAuthenticationSucceeded: function() {
      this.controllerFor('application').set('lastLoginFailed',false);
	  this.send('checkTemplate');
    },
    sessionAuthenticationFailed: function(error) {
      this.controllerFor('application').set('lastLoginFailed',true);

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
	  this.send('checkTemplate');
    }
  }
});

