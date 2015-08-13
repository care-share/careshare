/* globals jQuery */

import Ember from 'ember';

var API = {

  token: null,
  login: function(username, password) {
    var self = this;

    var payload = {
      email: username,
      password: password
    };

    var deferred = jQuery.post('http://localhost:3000/auth/login', payload).then(
      function(data) {
        console.log("data: "+JSON.stringify(data));
        self.token = data.data.token;
        return {user: username, token: data.token};
      },
      function(error) {
        return { status: error.statusText, message: error.responseText };
      }
    );

    return Ember.RSVP.resolve(deferred);
  },

  logout: function() {
    var self = this;

    //var settings = {};
   // if (this.token) {
      var settings = {'token': this.token };
   // } 
    var deferred = jQuery.post('http://localhost:3000/auth/logout',settings).then(function() {
      self.token = null;
    });

    return Ember.RSVP.resolve(deferred);
  },

  get: function(resource) {
    var url = '/' + resource;
    var settings;

    if (this.token) {
      settings = { headers: { 'Authorization': 'Token token=' + this.token } };
    } else {
      settings = {};
    }

    var deferred = jQuery.ajax(url, settings).then(null, function(error) {
      return { status: error.statusText, message: error.responseText };
    });

    return Ember.RSVP.resolve(deferred);
  }

};

export default API;

