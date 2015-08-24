import Ember from 'ember';
import API from '../api';

export default Ember.Controller.extend({
    isSideBarDisplayed: true,
    lastLoginFailed: false,
    isShowingForm: true,
    accountRequestSucceeded: false,
    accountRequestFailed: false,
    role: 'user',
    patientCounter: 0,
    isAdmin: function() {
        return this.get('session').get('secure').role === 'admin';
    }.property('role'),
    actions:{
      accountRequest:function(){
        API.submitRequest(this.getProperties('first','last','email','pass'),this);
      },
      toggleSideBarVisibility:function(){
        this.set('isSideBarDisplayed',false);
      },
      openidlogin:function(){
        console.log("App controller: openidlogin");
        return this.get('session').authenticate('authenticator:custom', null);
      },
      validate:function(){
        console.log("App controller: validate");
        var credentials = this.getProperties('identification', 'password');
        console.log("ID: "+credentials.identification+",PASS: "+credentials.password);
        return this.get('session').authenticate('authenticator:custom', credentials);
      },
      invalidate:function(){
        console.log("App controller: invalidate "+JSON.stringify(this.get('session')));
        var credentials = this.getProperties('identification', 'password');
        return this.get('session').invalidate(credentials);
      },
      patientsCount:function(){
        console.log('getPatientCount called!');
        return 5;
      }.property('model', 'patientCounter'),
    toggleLoginForm: function(){
      this.set('lastLoginFailed',false);
      this.set('accountRequestSucceeded',false);
      this.set('accountRequestFailed',false);
      this.toggleProperty('isShowingForm');
    }
    }
});
