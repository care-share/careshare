import Ember from 'ember';

var PatientsController = Ember.ArrayController.extend({
  actions:  {
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
