import Ember from 'ember';

export default Ember.Component.extend({
  createMessage: 'createMessage',
  chatMessages: null,
  unreadCount: null,
  setup: function(){
    this.set('chatMessages',this.get('resource.comms'));
    this.set('unreadCount',this.get('resource.unreadCount'));
    console.log("COMM CHANNEL setup: "+this.get('chatMessages'));
  }.on('init'),
  actions:{
    createMessage: function(message){
      console.log("COMM CHANNEL createMessage: "+message);
      this.sendAction('createMessage',message,this.get('resource.id'),this.get('resource_type'));
    },
    destroyMessage: function(message){
      console.log("COMM CHANNEL destroyMessage: "+message);
      this.get('resource.comms').removeObject(message);
    }
  }
});
