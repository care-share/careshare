import Ember from 'ember';

export default Ember.Component.extend({
  expanded: false,
  currentHover: false,
  updateArray: 'updateArray',
  deleteArray: 'deleteArray',
  saveArray: 'saveArray',
  setup: function(){
	if(this.get('parent')){
		console.log('(FHIR ARRAY) INIT ARRAY - record: '+
			this.get('parent')+',name: '+this.get('name')+',type: '+this.get('type'));
	}
  }.on('init'),
  actions:{
	updateArray: function(parent,name,type){
	 console.log('(FHIR_ARRAY) UPDATE ARRAY - record: '+
			parent+',name: '+name+',type: '+type);
	  this.sendAction('updateArray',parent,name,type);
    },
	updateArray: function(){
		this.sendAction('updateArray',this.get('parent'),this.get('name'),this.get('type'));
	},
	removeItem: function(index){
	  console.log('(FHIR_ARRAY) REMOVE ARRAY ITEM - parent: '+this.get('parent')+',index: '+index);
	  this.sendAction('removeItem',this.get('parent'),index);
    },
	toggleHover:function(){
      this.toggleProperty('currentHover'); 
    },
    toggleExpanded:function(){
      this.toggleProperty('expanded');	  
    }
  }
});