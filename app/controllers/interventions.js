import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    add:function(){
		this.store.createRecord('ProcedureRequest',{"resourceType":"ProcedureRequest"});
	}
  }
});