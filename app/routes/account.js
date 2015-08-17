import Ember from 'ember';
import API from '../api';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', /*API.unapproved(this.get('session').get('secure'))*/
    [{"name_first":"Goof","name_last":"Ball","email":"goof@goof.org","_id":"55d20de6b3f9ca6c16fcf346","role":"user"},{"name_first":"Dude","name_last":"Person","email":"dude@dude.org","_id":"55d20df5b3f9ca6c16fcf347","role":"user"}]);
  },
    actions: {
      approve: function(email){
        console.log("approve called");
        API.approve(email,this.get('session').get('secure'));
      },
      deny: function(email){
        console.log("deny called");
        API.deny(email,this.get('session').get('secure'));
      }
    }
});
