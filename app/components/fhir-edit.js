import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
	original: null,
	patcher: null,
    classNames: ['fhir-edit'],
    setup: function () {
	    this.set('original',this.get('attribute'));
		this.set('patcher',new diff_match_patch());
        console.log('INIT: FHIR-EDIT- attribute: ' + this.get('attribute') + ',name: ' + this.get('name'));	
    }.on('init'),
	attrObserve: function () {
	    var patcher = this.get('patcher');
	    var diff = patcher.diff_main(this.get('original'),this.get('attribute'),true);
		var patch_list = patcher.patch_make(this.get('original'),this.get('attribute'),diff);
        console.log('Typed: ' + this.get('attribute'));
		console.log('Diff: ' + patcher.patch_toText(patch_list));
    }.observes('attribute')
});
