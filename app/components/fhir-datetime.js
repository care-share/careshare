import Ember from 'ember';

export default Ember.Component.extend({
  isEditing:false,
  originalValue: '',
  date1: '',
  setup: function(){
    var date = new Date(this.get('attribute'));
    this.set('date1',date.getUTCFullYear()+"-"+(date.getUTCMonth()+1<10?'0':'')+(date.getUTCMonth()+1)+"-"+date.getUTCDate()
		+'T'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());
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
      if(this.get('attribute') && this.get('attribute').length > 0){
        var date = new Date(Ember.Date.parse(this.get('attribute')));
        this.set('attribute',date);
        //var date = new Date(this.get('attribute'));
        this.set('date1',
			date.getUTCFullYear()+"-"+(date.getUTCMonth()+1<10?'0':'')+(date.getUTCMonth()+1)+"-"+date.getUTCDate()
				+'T'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());
		this.set('isEditing',false);
      }     
    }
  }
});
