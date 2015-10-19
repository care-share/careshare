import Ember from 'ember';

export default Ember.Component.extend({
  expanded: false,
  actions:{
    removeItem: function(){
      this.get('intervention').destroyRecord();
    },
    toggleExpanded:function(){
	  this.toggleProperty('expanded');
	}
  }
});