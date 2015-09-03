import Ember from 'ember';

export default Ember.Controller.extend({
    role: 'user',
    isAdmin: function() {
        return this.get('session').get('secure').role === 'admin';
    }.property('role'),
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
      changeRole: function(email,role){
        console.log("change role(controller) called");
        var oppositeRole = 'admin';
        if(role === 'admin'){
          oppositeRole = 'user';
        }
        this.get('target').send('changeRole',email,oppositeRole,this.get('session').get('secure'),this);
      }
    }
});