import Ember from 'ember';

export default Ember.Component.extend({
  expanded: false,
  currentHover: false,
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
  	   
    },
    toggleHover:function(){
      this.toggleProperty('currentHover');
       
    }
  }
});