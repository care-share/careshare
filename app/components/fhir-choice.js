import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'span',
	original: '',
	patcher: null,
	canceled: false,
	calculatedPatch: '',
    classNames: ['fhir-choice'],
    finalChoices: [],
    setup: function () {
	    if(this.get('original') === undefined)
	        this.set('original','');
		this.set('patcher',new diff_match_patch());
        this.set('finalChoices', this.get('choices').split(','));
		console.log('INIT: FHIR-CHOICE- attribute: ' + this.get('original'));	
    }.on('init'),
	attrObserve: function () {
	    if(this.get('canceled') === true){
		    this.set('canceled',false);
			return;
	    }
	    console.log('fhir-choice attribute changed: '+this.get('attribute'));
	    var patcher = this.get('patcher');
	    var diff = patcher.diff_main(this.get('original'),this.get('attribute'),true);
		this.set('calculatedPatch',patcher.diff_prettyHtml(diff));
    }.observes('attribute'),
	actions:{
	    cancel: function(){
		    this.set('attribute',this.get('original'));
			this.set('calculatedPatch','');
	        console.log('fhir-choice calculatedPatch: '+this.get('calculatedPatch'));
		    this.set('canceled',true);
		}
	}
});