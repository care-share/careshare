import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
	original: null,
	diffAttribute: null,
	patcher: null,
	calculatedPatch: '',
    classNames: ['fhir-edit'],
    setup: function () {
	    this.set('patcher',new diff_match_patch());
	    this.set('original',this.get('parent').get(this.get('name')));
		console.log('(FHIR-EDIT) parent: '+this.get('parent')+', name: '+this.get('name')
		    +', original: '+this.get('original')+', diffAttribute is named: parent.'+this.get('name')+'Diff');
		this.set('diffAttribute',this.get('parent.' + this.get('name') + 'Diff'));	
    }.on('init'),
	attrObserve: function () {
	    console.log('(FHIR-EDIT) diffAttribute altered, diffAttribute is: '+this.get('diffAttribute'));
		if(this.get('diffAttribute') !== null && this.get('diffAttribute') !== undefined){
			var patcher = this.get('patcher');
			var diff = patcher.diff_main(this.get('original'),this.get('diffAttribute'),true);
			this.set('calculatedPatch',patcher.diff_prettyHtml(diff));
		}else{
		    this.set('diffAttribute',this.get('original'));
			this.set('calculatedPatch','');
		}
    }.observes('diffAttribute'),
	actions:{
	    cancel: function(){
		    this.set('diffAttribute',this.get('original'));
			this.set('calculatedPatch','');
		}
	}
});