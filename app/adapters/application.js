import Ember from 'ember';
import DS from 'ember-data';

let ApplicationAdapter = DS.RESTAdapter.extend({
  pathForType: function(type){
	console.log("incoming type: "+type);
	console.log("outgoing type: "+Ember.String.capitalize(Ember.String.camelize(type)));
    return Ember.String.capitalize(Ember.String.camelize(type));
  },
  keyForAttribute: function(attr) {
    return Ember.String.capitalize(Ember.String.camelize(attr));
  }
});

export default ApplicationAdapter;