import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
	createRecord: function(type){
		console.log('CREATE RECORD - type: '+type);
		this.store.createRecord(type,{id:new Date().getTime() / 1000});
	},
	updateRecord: function(record,name,type){
		console.log('UPDATE RECORD - parent: '+record+',name: '+name+',type: '+type);
		if(record && !record.get(name)){
			var newRecord = this.store.createRecord(type,{});
			console.log('++NEW RECORD: '+newRecord+'++');
			record.set(name,newRecord);
		}else{console.log('!!FAILED - parent does not exist or record already exists!!');}
	}
  }
});