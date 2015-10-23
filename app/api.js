/* globals jQuery */

import Ember from 'ember';
import config from './config/environment';

var API = {
  host: config.APP.apiUrl,
  openidlogin: function(data) {
    console.log("openidlogin sent with code: "+data);
    var deferred = jQuery.ajax(this.host+'/auth/openid?code='+data, null).then(
      function(data) {
        console.log("data: "+JSON.stringify(data));
        console.log("token: "+data.data.token);
        return {token: data.data.token,name_first:data.data.name_first,roles:data.data.roles,email:data.data.email};
      },
      function(error) {
        return { status: error.statusText, message: error.responseText };
      }
    );
    return Ember.RSVP.resolve(deferred);
  },
  login: function(username, password) {
    var payload = {
      email: username,
      password: password
    };

    var deferred = jQuery.post(this.host+'/auth/login', payload).then(
      function(data) {
        console.log("data: "+JSON.stringify(data));
        console.log("token: "+data.data.token);
        return {token: data.data.token,name_first:data.data.name_first,roles:data.data.roles,email:data.data.email};
      },
      function(error) {
        return { status: error.statusText, message: error.responseText };
      }
    );
    return Ember.RSVP.resolve(deferred);
  },
  submitRequest: function(info,controller){
     console.log('Account request sent: Full Name - '+info.fullName+',Email - '+info.email);
     Ember.$.ajax({
        type: "POST",
        url: this.host+'/auth/register',
        data: { name_first: info.first, name_last: info.last, email: info.email, password: info.pass },
        success : function() {
                    console.log("Account request submission succeeded.");
                    controller.set('accountRequestFailed',false);
                    controller.set('accountRequestSucceeded',true);
                },
        error: function(){
          console.log("Account request submission failed.");
          controller.set('accountRequestSucceeded',false);
          controller.set('accountRequestFailed',true);
        }
      });
  },
  roles: function(input, controller) {
    console.log('ask for all roles w/ token: '+input.token);
    //var email = input.email;
    jQuery.ajax(this.host+'/users/roles',{headers:{'X-Auth-Token':input.token}}).then(
      function(response){
        console.log("ROLES: "+JSON.stringify(response.data));
        controller.set('roles', response.data);
        return response.data;
      }, function(error) {
        return { status: error.statusText, message: error.responseText };
    });
  },
  approved: function(input,controller){
    console.log('ask for all approved users w/ token: '+input.token);
    //var email = input.email;
    jQuery.ajax(this.host+'/users/approved',{headers:{'X-Auth-Token':input.token}}).then(
    function(response){
      console.log("APPROVED: "+JSON.stringify(response.data));
      controller.set('approved', response.data);
      return response.data;
    }, function(error) {
      return { status: error.statusText, message: error.responseText };
    });
 },
 unapproved: function(input,controller){
    console.log('ask for unapproved w/ token: '+input.token);
    jQuery.ajax(this.host+'/users/unapproved',{headers:{'X-Auth-Token':input.token}}).then(
    function(response){
      console.log("UNAPPROVED: "+JSON.stringify(response.data));
      controller.set('model', response.data);
      return response.data;
    }, function(error) {
      return { status: error.statusText, message: error.responseText };
    });
 },
  logout: function(data) {
    jQuery.post(this.host+'/auth/logout',{headers:{'X-Auth-Token':data.token}}).then(function() {
    });
    return Ember.RSVP.resolve({token:null});
  },
  approve: function(email,data,controller) {
    console.log("APPROVE: "+email);
    Ember.$.ajax({
      url: this.host+'/users/'+email+'/approve',
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
      url: this.host+'/users/'+email,
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
  },
  addRole: function(email,role,data,controller) {
    console.log("ADD ROLE: "+role+" FOR USER "+email);
    return changeRole(this.host, email, role, data, controller, true);
  },
  removeRole: function(email,role,data,controller) {
    console.log("REMOVE ROLE: "+role+" FOR USER "+email);
    return changeRole(this.host, email, role, data, controller, false);
  }
};

function changeRole(host, email, role, data, controller, toggle) {
    var action = toggle ? 'put' : 'delete';
    Ember.$.ajax({
        url: host+'/users/'+email+'/roles/'+role,
        type: action,
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
export default API;

