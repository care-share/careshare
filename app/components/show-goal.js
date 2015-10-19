import Ember from 'ember';

export default Ember.Component.extend({
  expanded: false,
  actions:{
    removeItem: function(){
      this.get('goal').destroyRecord();
    },
    toggleExpanded:function(){
	  this.toggleProperty('expanded');
	}
  }
});