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
		var patch_list = patcher.patch_make(this.get('original'),this.get('attribute'),diff);
		var finalPatch = '';
		patcher.patch_toText(patch_list).split('\n').forEach(function(patch){
		    if(patch.length > 0 && patch.slice(0, '@@ '.length) !== '@@ '){
			    if(patch.slice(0,1) === '+'){
		        finalPatch += '<span style=\'background-color:#d4e2c1\'>'+patch.slice(1)+'</span>';
				}else if(patch.slice(0,1) === '-'){
				    finalPatch += '<s style=\'background-color:#fadee8\'>'+patch.slice(1)+'</s>';
				}else{finalPatch += patch.trim();}
			}
		});
		this.set('calculatedPatch',finalPatch);
    }.observes('attribute'),
	actions:{
	    cancel: function(){
		    this.set('attribute',this.get('original'));
		}
	}
});
