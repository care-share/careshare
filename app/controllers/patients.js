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
	  birthDate: new Date()
      });

      // Clear the text fields
      // this.set('familyName', '');
      // this.set('givenName', '');

      // Save the new model
      patient.save();
    }
  },


  filterText: '',

  filteredContent: function(){
    var filter = this.get('filterText');
    var rx = new RegExp(filter, 'gi');
    var patients = this.get('content');

    return patients.filter(function(patient) {
        if (typeof(patient.get('name.firstObject.family.firstObject')) !== 'undefined') {
	    return patient.get('fullName').match(rx);
	}
	return false;
    });

  }.property('model', 'filterText')
});


export default PatientsController;
