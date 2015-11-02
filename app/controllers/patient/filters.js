import Ember from 'ember';

export default Ember.Controller.extend({
  needs: "patient",
  patient: Ember.computed.alias("controllers.patient"),
  expandGoals: false,expandProblems: false,expandObservations: false,expandInterventions: false,expandMedications:false, expandParticipants: false,
  actions: {
  	toggleExpandProblems:function(){
	  this.toggleProperty("expandProblems")
    },
    toggleExpandGoals:function(){
	 	this.toggleProperty("expandGoals")
    },
    toggleExpandInterventions:function(){
      	this.toggleProperty("expandInterventions")
    },
    toggleExpandObservations:function(){
      	this.toggleProperty("expandObservations")
    },
	toggleExpandMedications:function(){
      	this.toggleProperty("expandMedications")
    },
    toggleExpandParticipants:function(){
	  this.toggleProperty("expandParticipants")
    },
  }
});