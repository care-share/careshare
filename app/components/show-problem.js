import Ember from 'ember';

export default Ember.Component.extend({
  expanded: false,
  actions:{
	altered: function(){
		console.log("altered called!");
	},
    removeItem: function(){
      this.get('problem').destroyRecord();
    },
    toggleExpanded:function(){
	  this.toggleProperty('expanded');
	}
  }
});