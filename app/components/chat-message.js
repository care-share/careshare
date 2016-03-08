import Ember from 'ember';

export default Ember.Component.extend({
  message_content: null,
  destroyMessage: 'destroyMessage',
  init: function(){
    this.set('message.hasSeen',true);
    console.log('CHAT MESSAGE content: '+this.get('message.content')+',src_user_id: '+this.get('message.src_user_id'));
  }.on('init'),
  actions:{
    destroyMessage: function(){
      this.sendAction('destroyMessage',this.get('message'));
      //message.destroyRecord();
    }
  }
});
