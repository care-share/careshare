import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    updateRecord: function(parent,name,type){
	  this.sendAction('updateRecord',parent,name,type);
    }
  }
});