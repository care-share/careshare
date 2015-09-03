import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('dashboard');
  this.route('login');
  this.resource('account',{path:'/account'});
  this.resource('patients',{path:'/patients'}, function() {
    this.resource("patient", { path: "/:patient_id" }, function() {
      this.route("init", {path: "/init"});
    });
  });
});
