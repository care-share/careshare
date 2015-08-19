/* globals jQuery */

import Ember from 'ember';

var API = {
  host: "http://localhost:3000/",
  login: function(username, password) {
    var payload = {
      email: username,
      password: password
    };

    var deferred = jQuery.post(this.host+'auth/login', payload).then(
      function(data) {
        console.log("data: "+JSON.stringify(data));
        console.log("token: "+data.data.token);
        return {token: data.data.token,name_first:data.data.name_first,role:data.data.role,email:data.data.email};
      },
      function(error) {
        return { status: error.statusText, message: error.responseText };
      }
    );
    return Ember.RSVP.resolve(deferred);
  },
 unapproved: function(input,controller){
    console.log('ask for unapproved w/ role '+input.role+' and token: '+input.token);
    jQuery.ajax(this.host+'users/unapproved',{headers:{'X-Auth-Token':input.token}}).then(
    function(response){
      console.log("UNAPPROVED: "+JSON.stringify(response.data));
      controller.set('model', response.data);
      return response.data;
    }, function(error) {
      return { status: error.statusText, message: error.responseText };
    });
 },
  logout: function(data) {
    jQuery.post(this.host+'auth/logout',{headers:{'X-Auth-Token':data.token}}).then(function() {
    });
    return Ember.RSVP.resolve({token:null});
  },
  approve: function(email,data,controller) {
    console.log("APPROVE: "+email);
    Ember.$.ajax({
      url: this.host+'users/'+email+'/approve',
      type: 'post',
      headers: {
          'X-Auth-Token': data.token
      },
      dataType: 'json',
      success: function (data) {
          console.info(data);
          controller.send('reset');
      }
    });

    return false;
  },
  deny: function(email,data,controller) {
    console.log("DENY: "+email);
    Ember.$.ajax({
      url: this.host+'users/'+email,
      type: 'delete',
      headers: {
          'X-Auth-Token': data.token
      },
      dataType: 'json',
      success: function (data) {
          console.info(data);
          controller.send('reset');
      }
    });
    
    return false;
  }
};

export default API;

