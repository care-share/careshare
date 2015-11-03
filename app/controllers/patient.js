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
    addReference: function(referringObject, referredObject, attributeName, isListAttribute) {
	// creates a FHIR reference to referredObject and adds it to the attribute named in listName
	var reference = this.store.createRecord('reference', {
	    reference: `${referredObject._internalModel.modelName}/${referredObject.id}`
	});
	if(isListAttribute) { // for reference attributes with any allowed length
	    var references = referringObject.get(attributeName).toArray();
	    // TODO: should add logic to check if the reference already exists
	    // We end up adding duplicates, but that won't break anything for now
	    references.addObject(reference);
	    referringObject.set(attributeName, references);
	} else { // for reference attributes that allow only one value
	    referringObject.set(attributeName, [reference]);
	}
	referringObject.save();
    },
    actions:{
      createRelation: function(draggedObject, options) {
	  console.log( "createRelation called");
	  var ontoObject = options.target.ontoObject;
	  var ontoModel = ontoObject._internalModel.modelName;
	  var draggedModel = draggedObject._internalModel.modelName;
	  var ontoID = options.target.ontoObject.id;

	  // Architectural logic for how we create the link:
	  // (we need to know which type should be the referrer, and what attribute the reference list lives in, and whether that attribute allows multiple values)
	  switch(ontoModel, draggedModel) {
	  case ("goal","condition"):
	  case ("goal","procedure-request"):
	  case ("goal","nutrition-order"):
	      this.addReference(ontoObject, draggedObject, "addresses", true);
	      break;
	  case ("condition","goal"):
	  case ("procedure-request","goal"):
	  case ("nutrition-order","goal"):
	      this.addReference(draggedObject, ontoObject, "addresses", true);
	      break;
	  case ("condition","medication-order"):
	      this.addReference(draggedObject, ontoObject, "reason", false);
	      break;
	  case ("medication-order","condition"):
	      this.addReference(ontoObject, draggedObject, "reason", false);
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
