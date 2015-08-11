import Ember from 'ember';

export default Ember.Controller.extend({
    isSideBarDisplayed: true,
    lastLoginFailed: false,
    isShowingForm: true,
    role: 'user',
    patientCounter: 0,
    isAdmin: function() {
        return this.get('session').content.secure.user.role === 'admin';
    }.property('role'),
    actions:{
      accountRequest:function(){
      var info = this.getProperties('fullName','email');
        alert('Account request sent: Full Name - '+info.fullName+',Email - '+info.email);
      },
      toggleSideBarVisibility:function(){
        this.set('isSideBarDisplayed',false);
      },
      validate:function(){
        console.log("App controller: validate");
        var credentials = this.getProperties('identification', 'password');
        console.log("ID: "+credentials.identification+",PASS: "+credentials.password);
        return this.get('session').authenticate('authenticator:custom', credentials);
      },
      invalidate:function(){
        console.log("App controller: invalidate");
        var credentials = this.getProperties('identification', 'password');
        return this.get('session').invalidate(credentials);
      },
      patientsCount:function(){
        console.log('getPatientCount called!');
        return 5;
      }.property('model', 'patientCounter')
      ,
    toggleLoginForm: function(){
      this.toggleProperty('isShowingForm');
    }
    }
});
