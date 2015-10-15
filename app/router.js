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
  });
  this.route('patient',{path:'/patient/:patient_id'});
});
