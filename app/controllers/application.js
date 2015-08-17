import Ember from 'ember';

export default Ember.Controller.extend({
    isSideBarDisplayed: true,
    lastLoginFailed: false,
    isShowingForm: true,
    role: 'user',
    patientCounter: 0,
    isAdmin: function() {
    console.log("THIS session:"+JSON.stringify(this.get('session').get('content')));
        return /*this.get('session').content.secure.user.role === 'admin'*/false;
    }.property('role'),
    actions:{
      accountRequest:function(){
      var info = this.getProperties('first','last','email','pass');
      //  alert('Account request sent: Full Name - '+info.fullName+',Email - '+info.email);
         Ember.$.ajax({
        type: "POST",
        url: "http://localhost:3000/auth/register",
        data: { name_first: info.first, name_last: info.last, email: info.email, password: info.pass },
        success : function(data) {
                    console.log("Account request submission succeeded."+data);
                },
        error: function(){
          console.log("Account request submission failed.");
        }
      });
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
        console.log("App controller: invalidate "+JSON.stringify(this.get('session')));
        var credentials = this.getProperties('identification', 'password');
        return this.get('session').invalidate(credentials);
      },
      patientsCount:function(){
        console.log('getPatientCount called!');
        return 5;
      }.property('model', 'patientCounter'),
    toggleLoginForm: function(){
      this.toggleProperty('isShowingForm');
    }
    }
});
