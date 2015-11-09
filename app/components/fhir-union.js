import Ember from 'ember';

export default Ember.Component.extend({
  isTypeChosen:false,
  isExpanded:false,
  allChoices: [],
  myChoice: {name: 'none',type: 'None selected'},
  setup: function(){
	this.set('allChoices',JSON.parse(this.get('choices')));
	console.log('fhir-union setup: '+this.get('allChoices'));
	for(var item in JSON.parse(this.get('choices'))){
		console.log(item.toString());
	}
    //this.get('allChoices').forEach(function(item){
		//console.log('root: '+this.get('root'));
		/*if(this.get('root').get(item.name)){
			this.set('myChoice',item);
			this.set('isTypeChosen',true);
		}*/
	//});
  }.on("init"),
  actions:{
    setChoice: function(choice){
		this.set('myChoice',choice);
		this.set('isExpanded',false);
		this.set('isTypeChosen',true);
		console.log('Type chosen: '+this.get('myChoice'));
	},
	toggleExpanded: function(){
		console.log('Toggle expanded');
		this.set('isExpanded',!this.get('isExpanded'));
	}
  }
});