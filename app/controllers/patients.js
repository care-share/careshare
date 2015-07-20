import Ember from 'ember';

var PatientsController = Ember.ArrayController.extend({
  actions:  {
    createPatient: function() {
      var givenName = this.get('givenName');
      var familyName = this.get('familyName');
      if (!givenName.trim() || !familyName.trim()) { return; }

      var name = this.store.createRecord('patient', {
	  given: givenName,
	  family: familyName
      });
      var patient = this.store.createRecord('patient', {
	  names: [name],
	  birthDate: new Date()
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
    var filter = this.get('filterText');
    var rx = new RegExp(filter, 'gi');
    var patients = this.get('content');

    var counter = 0;
    patients.filter(function(patient) {
      counter++;
    });
    return counter;
  }.property('model','patientCounter'),
  filterText: '',
  filteredContent: function(){
    var filter = this.get('filterText');
    var rx = new RegExp(filter, 'gi');
    var patients = this.get('content');

    return patients.filter(function(patient) {
      console.log('patient:'+patient.get('fullName'));
      if(patient.get('fullName') != null)
      return patient.get('fullName').toString().match(rx);
    });

  }.property('model', 'filterText')
});


export default PatientsController;
