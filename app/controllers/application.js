import Ember from 'ember';

export default Ember.Controller.extend({
    isSideBarDisplayed: true,
    patientCounter: 0,
    actions:{
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
    }
});
