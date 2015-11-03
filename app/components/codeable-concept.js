import Ember from 'ember';

export default Ember.Component.extend({
  updateRecord: 'updateRecord',
  updateArray: 'updateArray',
  removeItem: 'removeItem',
  saveRecord: 'saveRecord',
  actions:{
    updateRecord: function(parent,name,type){
	 console.log('(CODEABLE-CONCEPT) UPDATE RECORD - record: '+
			parent+',name: '+name+',type: '+type);
	  this.sendAction('updateRecord',parent,name,type);
    },
    saveRecord: function(){
	  console.log('(CODEABLE-CONCEPT) SAVE RECORD');
	  if(!this.get('root')){
		this.get('parent').save();
	  }else{
		this.get('root').save();
		//this.set('expanded',false);
	  }
    },
	removeItem: function(record,index){
	  console.log('(CODEABLE-CONCEPT) REMOVE ARRAY ITEM - parent: '+record+',index: '+index);
	  this.sendAction('removeItem',record,index);
    },
	updateArray: function(parent,name,type){
	 console.log('(CODEABLE-CONCEPT) UPDATE ARRAY - record: '+
			parent+',name: '+name+',type: '+type);
	  this.sendAction('updateArray',parent,name,type);
    }
  }
});