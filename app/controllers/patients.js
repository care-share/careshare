import Ember from 'ember';

var PatientsController = Ember.ArrayController.extend({
  filterText: '',

  filteredContent: function(){
    var filter = this.get('filterText');
    var rx = new RegExp(filter, 'gi');
    console.log("filterText:"+filter);
    var patients = this.get('content');
    console.log("patients: '"+patients+"'");

    return patients.filter(function(patient) {
        console.log('patient:'+patient.get('fullName'));
      return patient.get('fullName').toString().match(rx);
    });

  }.property('model', 'filterText')
});


export default PatientsController;
