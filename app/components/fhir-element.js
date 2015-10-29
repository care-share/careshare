import Ember from 'ember';

export default Ember.Component.extend({
  expanded: false,
  currentHover: false,
  updateRecord: 'updateRecord',
  deleteRecord: 'deleteRecord',
  saveRecord: 'saveRecord',
  setup: function(){
	if(this.get('parent')){
		console.log('(FHIR ELEMENT) UPDATE RECORD - record: '+
			this.get('parent')+',name: '+this.get('name')+',type: '+this.get('type'));
		this.sendAction('updateRecord',this.get('parent'),this.get('name'),this.get('type'));
	}
  }.on('init'),
  actions:{
    deleteRecord: function(){
      console.log('(FHIR ELEMENT) DELETE RECORD - record: '+this.get('root'));
      this.get('root').destroyRecord();
    },
      toggleHover:function(){
        this.toggleProperty('currentHover');
         
    },

    saveRecord: function(){
      console.log('(FHIR ELEMENT) SAVE RECORD - record: '+this.get('root'));
      this.get('root').save();
      this.set('expanded',false);
    },
    toggleExpanded:function(){
      this.toggleProperty('expanded');	  
    }
  }
});