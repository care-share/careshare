/* globals jQuery */

import Ember from 'ember';

var API = {
  host: "http://localhost:3000/",
  openidlogin: function() {
    var deferred = jQuery.post(this.host+'auth/openidlogin', null).then(
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
  submitRequest: function(info,controller){
     console.log('Account request sent: Full Name - '+info.fullName+',Email - '+info.email);
     Ember.$.ajax({
        type: "POST",
        url: "http://localhost:3000/auth/register",
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
  approved: function(input,controller){
    console.log('ask for all approved users w/ token: '+input.token);
    var email = input.email;
    jQuery.ajax(this.host+'users/approved',{headers:{'X-Auth-Token':input.token}}).then(
    function(response){
      console.log("APPROVED: "+JSON.stringify(response.data));
      var responseArray = response.data;
      var removeIndex = -1;
      Ember.$.each(responseArray, function(index, result) {
        if(result.email === email) {
            console.log("MATCHED!");
            removeIndex = index;
            //Remove from array
            //responseArray.splice(index, 1);
        }  
      });
      responseArray.splice(removeIndex,1);
      controller.set('approved', responseArray);
      return response.data;
    }, function(error) {
      return { status: error.statusText, message: error.responseText };
    });
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
  },
  changeRole: function(email,role,data,controller) {
    console.log("CHANGE ROLE: "+email+" to: "+role);
    Ember.$.ajax({
      url: this.host+'users/'+email+'/role/'+role,
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
};

export default API;

