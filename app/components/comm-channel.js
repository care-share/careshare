import Ember from 'ember';

export default Ember.Component.extend({
  createMessage: 'createMessage',
  destroyMessage: 'destroyMessage',
  actions:{
    createMessage: function(message){
      console.log("COMM CHANNEL createMessage: "+message);
      this.sendAction('createMessage',message,this.get('resource.id'),this.get('resource_type'));
    },
    destroyMessage: function(message){
      console.log("COMM CHANNEL destroyMessage: "+message);
      message.destroyRecord();
    }
  }
});
