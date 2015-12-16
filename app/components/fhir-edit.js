import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
	original: null,
	patcher: null,
	calculatedPatch: '',
    classNames: ['fhir-edit'],
    setup: function () {
	    this.set('original',this.get('attribute'));
		this.set('patcher',new diff_match_patch());
        console.log('INIT: FHIR-EDIT- attribute: ' + this.get('attribute') + ',name: ' + this.get('name'));	
    }.on('init'),
	attrObserve: function () {
	    var patcher = this.get('patcher');
	    var diff = patcher.diff_main(this.get('original'),this.get('attribute'),true);
		this.set('calculatedPatch',patcher.diff_prettyHtml(diff));
    }.observes('attribute'),
	actions:{
	    cancel: function(){
		    this.set('attribute',this.get('original'));
		}
	}
});
