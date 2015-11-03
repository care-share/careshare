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
    {
      var patientId = window.location.href.split('/')[4];
      var mystore = this.store;
      this.store.query('MedicationOrder', {"patient": patientId}).then(function(response){
        var promises = [];
        var mrholder = [];
        response.forEach(function(mo) {
          var momr = mo.get("medicationReference");
          if(momr == null) {
            console.debug("No Medication Reference for " + mo.get("id"));
            return;
          }
          mrholder[mrholder.length] = momr;
          var ref = momr.get("reference");
          var rid = ref.split("/")[1];
          var med = mystore.findRecord('medication', rid);
          promises[promises.length] = med;
        });

        Ember.RSVP.all(promises).then(function(res) {
          res.forEach(function(med) {
            var mr = mrholder.shift();
            mr.set("medication", med);
          });
          controller.set('medications',response);
        });
      });
    }

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
    toggleShowMedications:function(){
      var controller = this.controllerFor('careplan');
      controller.toggleProperty('showMedications');
      if(controller.get('showMedications')){
        // duplicate. figure out where ember wants helper code to live
        // or where this information should really be populated

        var patientId = window.location.href.split('/')[4];
        var mystore = this.store;
        this.store.query('MedicationOrder', {"patient": patientId}).then(function(response){
          var promises = [];
          var mrholder = [];
          response.forEach(function(mo) {
            var momr = mo.get("medicationReference");
            if(momr == null) {
              console.debug("No Medication Reference for " + mo.get("id"));
              return;
            }
            mrholder[mrholder.length] = momr;
            var ref = momr.get("reference");
            var rid = ref.split("/")[1];
            var med = mystore.findRecord('medication', rid);
            promises[promises.length] = med;
          });

          Ember.RSVP.all(promises).then(function(res) {
            res.forEach(function(med) {
              var mr = mrholder.shift();
              mr.set("medication", med);
            });
            controller.set('medications',response);
          });
        });
      }
    }
  }
});