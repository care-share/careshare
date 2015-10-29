import Ember from 'ember';

export default Ember.Controller.extend({
  needs: "patient",
  patient: Ember.computed.alias("controllers.patient")
});