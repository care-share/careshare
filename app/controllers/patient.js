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
    addReference: function(referringObject, referredObject, listName) {
	// creates a FHIR reference to referredObject and adds it to the attribute named in listName
	var references = referringObject.get(listName).toArray();
	// TODO: should add logic to check if the reference already exists
	// We end up adding duplicates, but that won't break anything for now
	var reference = this.store.createRecord('reference', {
	    reference: `Condition/${referredObject.id}`
	});
	references.addObject(reference);
	referringObject.set(listName, references);
	referringObject.save();
    },
    actions:{
      createRelation: function(draggedObject, options) {
	  console.log( "createRelation called");
	  var draggedModel = draggedObject._internalModel.modelName;
	  var ontoModel = options.target.ontoType; console.log(ontoModel);
	  var ontoID = options.target.ontoObject.id;
	  var ontoObject = options.target.ontoObject;

	  // Architectural logic for how we create the link:
	  // (we need to know which type should be the referrer, and what attribute the reference list lives in)
	  switch(ontoModel) {
	  case "goal":
	      switch(draggedModel) {
	      case "condition":
		  this.addReference(ontoObject, draggedObject, "addresses");
		  break;
	      default:
		  console.log("no link logic found");
	      }
	      break;
	  case "condition":
	      switch(draggedModel) {
	      case "goal":
		  this.addReference(draggedObject, ontoObject, "addresses");
		  break;
	      default:
		  console.log("no link logic found");
	      }
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
