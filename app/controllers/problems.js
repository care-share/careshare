import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
	createRecord: function(type){
		console.log('CREATE RECORD - type: '+type);
		this.store.createRecord(type,{id:new Date().getTime() / 1000});
	},
	updateArray: function(record,name,type){
	  console.log('(CONTROLLER) UPDATE ARRAY - parent: '+record+',name: '+name+',type: '+type);
	  var newRecord = this.store.createRecord(name,{});
	  if(record){
		console.log('Array exists - adding to array.');
		record.pushObject(newRecord);
	  }else{
		console.log('Array does not exist - creating new array.');
		record = [newRecord];
	  }
    },
    removeItem: function(record,index){
	  console.log('(CONTROLLER) REMOVE ARRAY ITEM - parent: '+record+',index: '+index);
	  if(record){
		console.log('Array exists - removing item.');
		record.removeAt(index);
	  }
    },
	updateRecord: function(record,name,type){
		console.log('(CONTROLLER) UPDATE RECORD - parent: '+record+',name: '+name+',type: '+type);
		if(record && !record.get(name)){
			var newRecord = null;
			console.log('MODEL NAME: '+record.toString());
			console.log('++NEW RECORD: '+newRecord+'++');
			record.set(name,newRecord);
		}else{console.log('!!FAILED - parent does not exist or record already exists!!');}
	}
  }
});