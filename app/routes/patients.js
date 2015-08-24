import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var patients = this.store.findAll('patient');
    if(patients.length > 0){
      return patients;
      }
  }
});
