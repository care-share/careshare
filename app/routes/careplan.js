import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

// actions are defined at: http://ember-simple-auth.com/ember-simple-auth-api-docs.html#SimpleAuth-ApplicationRouteMixin
export default Ember.Route.extend(ApplicationRouteMixin, {
  model: function(params) {
    var controller = this.controllerFor('careplan');
    console.log("Loading Careplan ROUTE")
    console.log(params)
    
    params.patient_id = this.controllerFor("patient").id;


    
    this.store.find('patient', params.patient_id).then(function(response) {
      controller.set('gender', response.get('gender').charAt(0).toUpperCase() +
        response.get('gender').substr(1));
      response.get('name').forEach(function(name) {
        controller.set('firstName', name.get('given'));
        controller.set('lastName', name.get('family'));
      });
      controller.set('birthDate', response.get('birthDate'));

    });
    //Load all information as the default has it showing
    this.store.query('Condition', {}).then(function(response) {
      controller.set('problems', response);
    });
    this.store.query('Goal', {}).then(function(response) {
      controller.set('goals', response);
    });
    this.store.query('ProcedureRequest', {}).then(function(response) {
      controller.set('interventions', response);
    });
    this.store.query('DiagnosticOrder', {}).then(function(response) {
      controller.set('observations', response);
    });

  },
  actions: {
    toggleShowProblems: function() {
      var controller = this.controllerFor('careplan');
      controller.toggleProperty('showProblems');
      if (controller.get('showProblems')) {
        this.store.query('Condition', {}).then(function(response) {
          controller.set('problems', response);
        });
      }
    },
    toggleShowGoals: function() {
      var controller = this.controllerFor('careplan');
      controller.toggleProperty('showGoals');
      if (controller.get('showGoals')) {
        this.store.query('Goal', {}).then(function(response) {
          controller.set('goals', response);
        });
      }
    },
    toggleShowInterventions: function() {
      var controller = this.controllerFor('careplan');
      controller.toggleProperty('showInterventions');
      if (controller.get('showInterventions')) {
        this.store.query('ProcedureRequest', {}).then(function(response) {
          controller.set('interventions', response);
        });
      }
    },
    toggleShowObservations: function() {
      var controller = this.controllerFor('careplan');
      controller.toggleProperty('showObservations');
      if (controller.get('showObservations')) {
        this.store.query('DiagnosticOrder', {}).then(function(response) {
          controller.set('observations', response);
        });
      }
    },
    toggleShowMedications: function() {
      this.controllerFor('careplan').toggleProperty('showMedications');
      //TODO: make a JSON adapter call for whatever FHIR element should be rendered in Medications tab.
    }
  }
});