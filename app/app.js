import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

//import './mock-server'; // API server for auth

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

/*App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: 'http://localhost:3000'
});*/

loadInitializers(App, config.modulePrefix);

var Handlebars;
Handlebars = Ember.Handlebars;
Handlebars.helper('header-format', function(value) {
  var escaped = Handlebars.Utils.escapeExpression(value);
  var n = escaped.indexOf('?');
  escaped = escaped.substring(0,n !== -1 ? n : escaped.length);
  escaped = escaped.replace('/','');
  escaped = escaped.charAt(0).toUpperCase() + escaped.slice(1);
  return new Ember.Handlebars.SafeString(escaped);
});
Handlebars.helper('is-admin', function(value) {
  console.log('is-admin: '+JSON.stringify(value)+";"+(value==='admin'));
  return value === 'admin';
});

/*App.ShowGoalComponent = Ember.Component.extend({
  isEditing:false,
  value:'Test',
  actions:{
    editItem: function() {
      this.set('isEditing',true);
    },
    saveItem: function(key){
      this.set('value',key);
      this.set('isEditing',false);
    }
  }
});*/

export default App;
