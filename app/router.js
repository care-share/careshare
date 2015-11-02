import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('dashboard');
  this.route('login');
  this.route('goals');
  this.resource('account',{path:'/account'});
  this.resource('patients', function() {
      this.route("init", { path: "/:patient_id/init" });

      this.resource('patient', { path: ":patient_id" }, function() {
	  this.resource('care-plans', function() {
	      this.route("new");
	  });
      });
  });
  //this.route('patient',{path:'/patient/:patient_id'});


   this.resource("patient", {path:'/patient/:patient_id'}, function() {
    this.route("filters");
    this.route("patientInfo");
    this.route("notes");
    this.route("history");
    this.route("requests");
  });

});
