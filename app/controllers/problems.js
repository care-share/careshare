import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    add:function(){
		var codeable = this.store.createRecord('CodeableConcept',{});
		this.store.createRecord('Condition',{"code":codeable});
	}
  }
});