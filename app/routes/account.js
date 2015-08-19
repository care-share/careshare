import Ember from 'ember';
import API from '../api';

export default Ember.Route.extend({
  setupController: function(controller) {
    API.unapproved(this.get('session').get('secure'),controller);
    API.approved(this.get('session').get('secure'),controller);
  },
    actions: {
      reset: function(controller){
        API.unapproved(this.get('session').get('secure'),controller);
        API.approved(this.get('session').get('secure'),controller);
      },
      approve: function(email,session,controller){
        console.log("approve(route) called");
        API.approve(email,session,controller);
      },
      deny: function(email,session,controller){
        console.log("deny(route) called");
        API.deny(email,session,controller);
      }
    }
});
