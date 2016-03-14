import Ember from 'ember';

export default Ember.Component.extend({
  createMessage: 'createMessage',
  destroyMessage: 'destroyMessage',
  chatMessages: null,
  unreadCount: null,
  parsedTimestamp: function(){
    var result = new Date(Ember.Date.parse(this.get('')));
    console.log('datePassthrough set value: ' + value + ',result: ' + result);
    this.set('passthrough', this.get('isArray') ? [result] : result);
    return (("0" + (result.getMonth() + 1)).slice(-2) + '/' + ("0" + result.getDate()).slice(-2) + '/' + result.getFullYear() + ' '
    + ((result.getHours() > 12) ? (result.getHours() - 12) : (("0" + result.getHours()).slice(-2))) + ":" + ("0" + result.getMinutes()).slice(-2) +
    ((result.getHours() > 12) ? ' PM' : ' AM')).replace("00:00 AM", "");
  }.property('timestamp'),
  patientID: function(){
    //TODO THIS IS NOT AN ID FOR NOW - this will be used to make the delete only available to the user who creates it -MH
    return resource.parentController.patient.id;
  }.property('resource.parentController'),
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
      message.destroyRecord();
    }
  }
});
