import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.findAll('Goal').then(
      function(response) {
        console.log("PROMISE OK!: "+response);
        return response;
      }, function(error) {
        console.log("PROMISE ERROR! " + error);
      }
    );
  }
});
