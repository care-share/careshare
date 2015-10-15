import Ember from 'ember';

export default Ember.Component.extend({
  isEditing:false,
  originalValue: '',
  actions:{
    editItem: function() {
      console.log('editItem');
      this.set('originalValue',this.get('attribute'));
      this.set('isEditing',true);
    },
    cancel: function(){
      console.log('cancel');
      this.set('element.'+this.get('name'),this.get('originalValue'));
      this.set('isEditing',false);
    },
    saveItem: function(){
      console.log('saveItem');
      if(this.get('attribute').length > 0){
        if(this.get('element')){this.get('element').save();this.sendAction();}
		else{
			console.log('cancel');
			this.set('element.'+this.get('name'),this.get('originalValue'));
		}
      }
      this.set('isEditing',false);
    }
  }
});
