import Ember from 'ember';

export default Ember.Controller.extend({
    isSideBarDisplayed: true,
    patientCounter: 0,
    actions:{
      toggleSideBarVisibility:function(){
        this.set('isSideBarDisplayed',false);
      },
      validate:function(){
        this.get('session').authenticate('authenticator:custom', {});
      },
      patientsCount:function(){
        console.log('getPatientCount called!');
        return 5;
      }.property('model', 'patientCounter')
    }
});
