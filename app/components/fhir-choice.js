import Ember from 'ember';

export default Ember.Component.extend({
 isEditing:false,
 isExpanded:false,
 originalValue: '',
 finalChoices: [],
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
        this.get('element').save();
      }
      this.set('isEditing',false);
    },
    removeItem: function(){
      console.log('removeItem');
      this.set('element.'+this.get('name'),'');
      this.get('element').save();
      this.set('isEditing',false);
    },
    toggleExpanded: function() {
      this.set('isExpanded',!this.get('isExpanded'));
    },
    setChoice: function(choice){
      this.set('attribute',choice);
      this.set('isExpanded',!this.get('isExpanded'));
    }
 },
 onInitialization: function(){
    this.set('finalChoices',this.get('choices').split(','));
 }.on("init")
});
