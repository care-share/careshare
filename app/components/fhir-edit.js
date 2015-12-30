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
	    this.set('original',this.get('parent.' + this.get('name')));
		this.set('diffAttribute',this.get('parent.' + this.get('name') + 'Diff'));
        console.log('INIT: FHIR-EDIT- name: ' + this.get('name'));	
    }.on('init'),
	attrObserve: function () {
	    var patcher = this.get('patcher');
	    var diff = patcher.diff_main(this.get('original'),this.get('diffAttribute'),true);
		this.set('calculatedPatch',patcher.diff_prettyHtml(diff));
    }.observes('diffAttribute'),
	actions:{
	    cancel: function(){
		    this.set('diffAttribute',this.get('original'));
			this.set('calculatedPatch','');
		}
	}
});