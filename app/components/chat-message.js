import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    destroy: function(message){
      message.destroyRecord();
    }
  }
});
