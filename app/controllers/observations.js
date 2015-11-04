import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
	createRecord: function(type){
		console.log('CREATE RECORD - type: '+type);
		var id = this.controllerFor('patient').id;
		var reference = this.store.createRecord('reference', {
			reference: `Patient/${id}`
		});
		this.store.createRecord(type,{id:new Date().getTime() / 1000, subject: reference});
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