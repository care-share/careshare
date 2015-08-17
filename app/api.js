/* globals jQuery */

import Ember from 'ember';

var API = {

  token: null,
  userData: null,
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
        console.log("token: "+data.data.token);
        return {token: data.data.token,name_first:data.data.name_first,role:data.data.role};
      },
      function(error) {
        return { status: error.statusText, message: error.responseText };
      }
    );

    return Ember.RSVP.resolve(deferred);
  },
 unnapproved: function(){
  //TODO: GET call for uapproved account requests
 },
  logout: function(data) {
    var self = this;
    var deferred = jQuery.post('http://localhost:3000/auth/logout',{'token':data.token}).then(function() {
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

