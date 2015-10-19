import Ember from 'ember';

export default Ember.Component.extend({
  expanded: false,
  actions:{
    removeItem: function(){
      this.get('observation').destroyRecord();
    },
    toggleExpanded:function(){
	  this.toggleProperty('expanded');
	}
  }
});