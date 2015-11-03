import Ember from 'ember';

export default Ember.Component.extend({
  expanded: false,
  currentHover: false,
  updateRecord: 'updateRecord',
  deleteRecord: 'deleteRecord',
  saveRecord: 'saveRecord',
  setup: function(){
	if(this.get('parent')){
		console.log('(FHIR ELEMENT) UPDATE RECORD - record: '+
			this.get('parent')+',name: '+this.get('name')+',type: '+this.get('type'));
		this.sendAction('updateRecord',this.get('parent'),this.get('name'),this.get('type'));
	}
  }.on('init'),
  actions:{
    updateRecord: function(parent,name,type){
	 console.log('(FHIR ELEMENT [yet another]) UPDATE RECORD - record: '+
			parent+',name: '+name+',type: '+type);
	  this.sendAction('updateRecord',parent,name,type);
    },
    deleteRecord: function(){
      console.log('(FHIR ELEMENT) DELETE RECORD - record: '+this.get('root'));
      this.get('root').destroyRecord();
    },
    removeItem: function(index){
	  console.log('(FHIR_ELEMENT) REMOVE ARRAY ITEM - parent: '+this.get('parent')+',index: '+index);
	  this.sendAction('removeItem',this.get('parent'),index);
    },
    saveRecord: function(){
	  console.log('(FHIR ELEMENT) SAVE RECORD');
	  if(!this.get('root')){
		this.get('parent').save();
	  }else{
		this.get('root').save();
		//this.set('expanded',false);
	  }
    },
    toggleHover:function(){
      this.toggleProperty('currentHover');     
    },
    toggleExpanded:function(){
      this.toggleProperty('expanded');	  
    }
  }
});