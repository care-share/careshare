import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
      reset(){
        this.get('target').send('reset',this);
      },
      approve: function(email){
        console.log("approve(controller) called");
        this.get('target').send('approve',email,this.get('session').get('secure'),this);
      },
      deny: function(email){
        console.log("deny(controller) called");
        this.get('target').send('deny',email,this.get('session').get('secure'),this);
      },
      toggleRole: function(email, role, isHeld){
        console.log("toggleRole(controller) called");
        if (!isHeld)
          this.get('target').send('addRole',email,role,this.get('session').get('secure'),this);
        else
          this.get('target').send('removeRole',email,role,this.get('session').get('secure'),this);
      }
    }
});
