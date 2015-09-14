import Ember from 'ember';

export default Ember.Component.extend({
  isEditing:false,
  editable: null,
  field: null,
  value: '',
  actions:{
    editItem: function(element,attribute,name) {
      console.log(JSON.stringify(element)+','+name);
      this.set('editable',element);
      this.set('field',attribute);
      this.set('value',name);
      this.set('isEditing',true);
    },
    cancel: function(){
      console.log('cancel');
      this.set('isEditing',false);
    },
    saveItem: function(key){
      if(key.length > 0){
        console.log(this.get('field')+" request change to: "+key);
        this.set('field',key);
        this.get('editable').save();
      }
      this.set('isEditing',false);
    },
    removeItem: function(){
      console.log('removeItem called with: '+this.get('value'));
      this.set('editable.'+this.get('value'),'');
      this.get('editable').save();
      this.set('isEditing',false);
    }
  }
});
