import Ember from 'ember';

export default Ember.ObjectController.extend({
  isEditing:false,
  value:'Test',
  actions:{
    editItem: function() {
      this.set('isEditing',true);
    },
    saveItem: function(key){
      this.set('value',key);
      this.set('isEditing',false);
    }
  }
});
