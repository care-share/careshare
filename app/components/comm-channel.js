import Ember from 'ember';

export default Ember.Component.extend({
  createMessage: 'createMessage',
  actions:{
    createMessage: function(content){
      this.sendAction('createMessage',content,this.get('resource_type'));
    }
  }
});
