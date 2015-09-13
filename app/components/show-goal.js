import Ember from 'ember';

export default Ember.Component.extend({
  isEditing:false,
  editable: null,
  actions:{
    editItem: function(goal) {
      console.log(JSON.stringify(goal));
      this.set('editable',goal);
      this.set('isEditing',true);
    },
    cancel: function(){
      console.log('cancel');
      this.set('isEditing',false);
    },
    saveItem: function(key){
      if(key.length > 0){
        console.log(this.get('editable').status+" request change to: "+key);
        this.set('editable.status',key);
        this.get('editable').save();
      }
      this.set('isEditing',false);
    },
    removeItem: function(){
      this.set('editable.status','');
      this.get('editable').save();
      this.set('isEditing',false);
    }
  }
});
