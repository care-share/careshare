import Ember from 'ember';

export default Ember.Component.extend({
  isEditing:false,
  originalValue: '',
  setup: function(){
	console.log('INIT: FHIR-EDIT- name: '+this.get('name')+',attribute: '+this.get('attribute'));
  }.on('init'),
  actions:{
    editItem: function() {
      console.log('editItem');
      this.set('originalValue',this.get('attribute'));
      this.set('isEditing',true);
    },
    cancel: function(){
      console.log('cancel');
      this.set('attribute',this.get('originalValue'));
      this.set('isEditing',false);
    },
    saveItem: function(){
      console.log('saveItem');
      this.set('isEditing',false);
    }
  }
});
