import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'span',
	original: '',
	patcher: null,
    classNames: ['fhir-choice'],
    finalChoices: [],
    setup: function () {
	    this.set('finalChoices', this.get('choices').split(','));
		this.set('original',this.get('parent').get(this.get('name')));
	    this.set('patcher',new diff_match_patch());
		
		if(this.get('original') === null || this.get('original') === undefined){
		    this.set('original',this.get('finalChoices')[0]);
		}
		
		this.set('diffAttribute',this.get('original'));			
		console.log('(FHIR-CHOICE) parent: '+this.get('parent')+', name: '+this.get('name')
		    +', original: '+this.get('original')+', diffAttribute is named: parent.'+this.get('name')+'Diff');
    }.on('init'),
	calculatedPatch: function () {
	    console.log('(FHIR-CHOICE) diffAttribute altered, diffAttribute is: '+this.get('diffAttribute')+' and original is: '+this.get('original'));
		var patcher = this.get('patcher');
	    if(this.get('original') !== this.get('diffAttribute')){
		    var diff = patcher.diff_main(this.get('original'),this.get('diffAttribute'),true);
	        return patcher.diff_prettyHtml(diff);
		}else{return '';}
    }.property('diffAttribute'),
	actions:{
	    cancel: function(){
		    this.set('diffAttribute',this.get('original'));
		}
	}
});