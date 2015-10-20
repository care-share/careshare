import Ember from 'ember';

export default Ember.Component.extend({
  expanded: false,
  actions:{
    removeItem: function(element){
      element.destroyRecord();
    },
	saveItem: function(element){
	  element.save();
	  this.toggleProperty('expanded');
	},
    toggleExpanded:function(){
	  this.toggleProperty('expanded');
	}
  }
});