import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'span',
	diffAttribute: null,
	original: null,
	patcher: new diff_match_patch(),
    classNames: ['fhir-choice'],
    finalChoices: [],
    setup: function () {
	    this.set('finalChoices', this.get('choices').split(','));
		this.set('original',this.get('parent').get(this.get('name')));
        
        var existingDiff = this.get('parent').get(this.get('name')+'Diff');		
		if(existingDiff === null || existingDiff === undefined){
			if(this.get('original') === null || this.get('original') === undefined){
		        this.set('diffAttribute','');
		    }else{this.set('diffAttribute',this.get('original'));}	
		}else{this.set('diffAttribute',existingDiff);}
        
	    console.log('(FHIR-CHOICE) parent: '+this.get('parent')+', name: '+this.get('name')+', original: '+this.get('original')+', diffAttribute: '+this.get('diffAttribute'));
    }.on('init'),
	calculatedPatch: function () {
	    console.log('(FHIR-CHOICE) diffAttribute altered, diffAttribute is: '+this.get('diffAttribute')+' vs. original: '+this.get('original'));
	    if(this.get('diffAttribute') !== null && this.get('diffAttribute') !== undefined &&
		    this.get('original') !== this.get('diffAttribute')){
                //this.get('parent').set(this.get('name')+'Diff',this.get('diffAttribute'));
                if(this.get('original') !== null && this.get('original') !== undefined){
                    return '\<del style=\"background:\#ffe6e6;\"\>'+this.get('original')+'\<\/del\>'+
                    '\<ins style=\"background:\#e6ffe6;\"\>'+this.get('diffAttribute')+'\<\/ins\>';
                }
                return this.get('patcher').diff_prettyHtml(this.get('patcher').diff_main('',this.get('diffAttribute'),true));
		}
		return '';
    }.property('diffAttribute'),
	actions:{
	    cancel: function(){
		    this.set('diffAttribute',
			    (this.get('original') !== null && this.get('original') !== undefined) ? this.get('original') : '');
		}
	}
});