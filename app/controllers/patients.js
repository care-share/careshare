import Ember from 'ember';

var PatientsController = Ember.ArrayController.extend({
  currentId: null,
  careplans: null,
  actions:  {
    toggleExpanded: function(){this.set('currentId',null);},
	setChoice: function(patient,careplan){
		console.log('Patient ID: '+patient+',CarePlan ID: '+careplan);
		if(careplan === -9999){this.set('currentId',null);}
		else{
			//this.transitionTo('patients.care-plans',patient,careplan);
			window.location.href = '/patients/'+patient+'/care-plans/'+careplan;
		}
	},
    getCarePlans: function(id){
	  console.log('GET CarePlans for id: '+id);
	  var parent = this;
	  this.store.find('CarePlan',{subject:id}).then(function(response){
	    console.log('Response: '+response.toArray().length+' items!');
		if(response != null){
			parent.set('currentId',id);
			if(response.toArray().length > 0){
				parent.set('careplans',response);
			}else{parent.set('careplans',[{description:"(NONE)",id:-9999}]);}
		}
	  });
	},
    createPatient: function() {
      var givenName = this.get('givenName');
      var familyName = this.get('familyName');
      if (!givenName.trim() || !familyName.trim()) { return; }

      var name = this.store.createRecord('human-name', {
	  given: givenName,
	  family: familyName
      });
      var patient = this.store.createRecord('patient', {
	  name: [name],
	  birthDate: new Date(),
	  active: true
      });

      // Clear the text fields
      // this.set('familyName', '');
      // this.set('givenName', '');

      // Save the new model
      patient.save();
    }
  },
  patientCounter: 0,
  patientCount: function(){
    var patients = this.get('content');
    var counter = 0;
    patients.filter(function() {
      counter++;
    });
    return counter;
  }.property('model','patientCounter'),
  filterText: '',
  filteredContent: function(){
    var filter = this.get('filterText');
    var rx = new RegExp(filter, 'gi');

    var returnedArr = this.get('content').filter(function(patient) {
      if(patient.get('name') !== null){      
        var thisPatient = patient.get('name').objectAt(0);
        var fullName = thisPatient.get('given')+','+thisPatient.get('family');
        console.log('patient:'+fullName);
        return fullName.match(rx);
      }
    });
    
    var sortedArr = returnedArr.sort(function(a,b){
      console.log(a.get('name').objectAt(0).get('family')+";"+b.get('name').objectAt(0).get('family'));
      return a.get('name').objectAt(0).get('family')-b.get('name').objectAt(0).get('family');
    });
    return sortedArr;
  }.property('model', 'filterText')
});


export default PatientsController;
