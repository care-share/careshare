import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
	diffAttribute: '',
	original: '',
	patcher: null,
	calculatedPatch: '',
    classNames: ['fhir-edit'],
    setup: function () {
	    this.set('patcher',new diff_match_patch());
		console.log('(FHIR-EDIT) parent: '+this.get('parent')+', name: '+this.get('name')
		    +', original: '+this.get('original')+', diffAttribute is named: parent.'+this.get('name')+'Diff');
		this.set('original',this.get('parent').get(this.get('name')));
		if(this.get('diffAttribute') !== null || this.get('diffAttribute') !== undefined){
		    this.set('diffAttribute',this.get('original'));	
		}
    }.on('init'),
	attrObserve: function () {
	    console.log('(FHIR-EDIT) diffAttribute altered, diffAttribute is: '+this.get('diffAttribute'));
		var patcher = this.get('patcher');
	    if(this.get('original') !== this.get('diffAttribute')){
		    var diff = patcher.diff_main(this.get('original'),this.get('diffAttribute'),true);
	        this.set('calculatedPatch',patcher.diff_prettyHtml(diff));
		}else{this.set('calculatedPatch','');}
    }.observes('diffAttribute'),
	actions:{
	    cancel: function(){
		    this.set('diffAttribute',this.get('original'));
			this.set('calculatedPatch','');
		}
	}
});