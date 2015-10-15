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
  renderTemplate: function(){
    //Render into main outlet.
	this.render();
	
	//Render into sidebar outlet.
	this.render("filters",{into:"application",outlet:"filters"});
  },
  actions: {
  	altered: function(){
		console.log("altered called!");
	},
  	toggleShowProblems:function(){
	  var controller = this.controllerFor('patient');
      controller.toggleProperty('showProblems');
	  if(controller.get('showProblems')){
		this.store.findAll('Condition').then(function(response){controller.set('problems',response);});
	  }
    },
    toggleShowGoals:function(){
	  var controller = this.controllerFor('patient');
      controller.toggleProperty('showGoals');
	  if(controller.get('showGoals')){
		this.store.findAll('Goal').then(function(response){controller.set('goals',response);});
	  }
    },
    toggleShowInterventions:function(){
      var controller = this.controllerFor('patient');
      controller.toggleProperty('showInterventions');
	  if(controller.get('showInterventions')){
		this.store.findAll('ProcedureRequest').then(function(response){controller.set('interventions',response);});
	  }
    },
    toggleShowObservations:function(){
      var controller = this.controllerFor('patient');
      controller.toggleProperty('showObservations');
	  if(controller.get('showObservations')){
		this.store.findAll('DiagnosticOrder').then(function(response){controller.set('observations',response);});
	  }
    },
	toggleShowMedications:function(){
      this.controllerFor('patient').toggleProperty('showMedications');
	  //TODO: make a JSON adapter call for whatever FHIR element should be rendered in Medications tab.
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
        }
      },
    sessionAuthenticationSucceeded: function() {
      this.controllerFor('application').set('lastLoginFailed',false);
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
    }
  }
});
