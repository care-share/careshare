import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

// actions are defined at: http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-ApplicationRouteMixin
export default Ember.Route.extend(ApplicationRouteMixin, {
  setupController: function(controller){
	console.log('patient setupController: '+window.location.href.split('/')[4]);
	this.store.find('patient',window.location.href.split('/')[4]).then(function(response){
		console.log('patient info: '+JSON.stringify(response));
		controller.set('gender',response.get('gender').charAt(0).toUpperCase()+
			response.get('gender').substr(1));
		console.log('name: '+response.get('name'));
		response.get('name').forEach(function(name) {
			controller.set('firstName',name.get('given'));
			controller.set('lastName',name.get('family'));
		});
		controller.set('birthDate',response.get('birthDate'));
	});
  },
  actions: {
  	toggleShowProblems:function(){
	  var controller = this.controllerFor('patient');
      controller.toggleProperty('showProblems');
	  if(controller.get('showProblems')){
		this.store.query('Condition', {}).then(function(response){controller.set('problems',response);});
	  }
    },
    toggleShowGoals:function(){
	  var controller = this.controllerFor('patient');
      controller.toggleProperty('showGoals');
	  if(controller.get('showGoals')){
		this.store.query('Goal', {}).then(function(response){controller.set('goals',response);});
	  }
    },
    toggleShowInterventions:function(){
      var controller = this.controllerFor('patient');
      controller.toggleProperty('showInterventions');
	  if(controller.get('showInterventions')){
		this.store.query('ProcedureRequest', {}).then(function(response){controller.set('interventions',response);});
	  }
    },
    toggleShowObservations:function(){
      var controller = this.controllerFor('patient');
      controller.toggleProperty('showObservations');
	  if(controller.get('showObservations')){
		this.store.query('DiagnosticOrder', {}).then(function(response){controller.set('observations',response);});
	  }
    },
	toggleShowMedications:function(){
      this.controllerFor('patient').toggleProperty('showMedications');
	  //TODO: make a JSON adapter call for whatever FHIR element should be rendered in Medications tab.
    }
  }
});
