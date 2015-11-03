import Ember from 'ember';
import API from '../api';

export default Ember.Controller.extend({
    apiUrl: window.Careshare.apiUrl,
	patient: null,
	firstName: 'Unknown',lastName: 'Unknown',gender: 'Unknown',birthDate: 'Unknown',
    isOpenID: window.Careshare.isOpenID,
    isSideBarDisplayed: true,
    lastLoginFailed: false,
    isShowingForm: true,
    accountRequestSucceeded: false,
    accountRequestFailed: false,
    errorMessage: 'An unknown error occurred.',
    errorType: 'alert-danger',
    patientCounter: 0,
    signInType: 'signin',
    showOpenID: false,
	goals: null,problems: null,observations: null,interventions: null,medications: null,
    showGoals: true,showProblems: true,showObservations: true,showInterventions: true,showMedications:true,
    addReference: function(referringObject, referredObject) {
	var addressesReferences = referringObject.get('addresses').toArray();
	// TODO: should add logic to check if the reference already exists
	// We end up adding duplicates, but that won't break anything for now
	var reference = this.store.createRecord('reference', {
	    reference: `Condition/${referredObject.id}`
	});
	addressesReferences.addObject(reference);
	referringObject.set('addresses', addressesReferences);
	referringObject.save();
    },
    actions:{
      createRelation: function(draggedObject, options) {
	  console.log( "createRelation called");
	  var draggedModel = draggedObject._internalModel.modelName;
	  var ontoModel = options.target.ontoType; console.log(ontoModel);
	  var ontoID = options.target.ontoObject.id;
	  var ontoObject = options.target.ontoObject;

	  // for proof of concept: for now assume we're dragging a goal to a condition
	  this.addReference(draggedObject, ontoObject);
	  
	  // Architectural logic for how we create the link:
	  switch(ontoModel) {
	  case "goal":
	      console.log("switched to goal");
	      switch(draggedModel) {
	      case "condition":
		  console.log("switched condition onto goal");
		  var conditionReference = this.store.createRecord('reference', {
		      reference: `Condition/${draggedID}`
		  });
		  break;
	      default:
		  console.log("no link logic found");
	      }
	      break;
	  case "condition":
	      console.log("switched to condition");
	      break;
	  default:
	      console.log("no link logic found");
	  }
      },

      accountRequest:function(){
        API.submitRequest(this.getProperties('first','last','email','pass'),this);
      },
      toggleSideBarVisibility:function(){
        this.set('isSideBarDisplayed',false);
      },
      openidlogin:function(data){
        console.log("App controller: openidlogin("+data+")");
        return this.get('session').authenticate('authenticator:custom', data);
      },
      validate:function(){
        console.log("App controller: validate");
        var credentials = this.getProperties('identification', 'password');
        console.log("ID: "+credentials.identification+",PASS: "+credentials.password);
        return this.get('session').authenticate('authenticator:custom', credentials);
      },
      invalidate:function(){
        console.log("App controller: invalidate "+JSON.stringify(this.get('session')));
        var credentials = this.getProperties('identification', 'password');
        return this.get('session').invalidate(credentials);
      },
      patientsCount:function(){
        console.log('getPatientCount called!');
        return 5;
      }.property('model', 'patientCounter'),
    toggleLoginForm: function(){
      this.set('lastLoginFailed',false);
      this.set('accountRequestSucceeded',false);
      this.set('accountRequestFailed',false);
      this.toggleProperty('isShowingForm');
    }
    }
});
