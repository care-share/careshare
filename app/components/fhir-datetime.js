import Ember from 'ember';
export default Ember.Component.extend({
	diffAttribute: null,
	original: null,
	patcher: new diff_match_patch(),
    classNames: ['fhir-datetime'],
	showModal: false,
	setup: function () {
		this.set('original',this.get('parent').get(this.get('name')));
        
        var existingDiff = this.get('parent').get(this.get('name')+'Diff');		
		if(existingDiff === null || existingDiff === undefined){
			if(this.get('original') === null || this.get('original') === undefined){
		        this.set('diffAttribute','');
		    }else{this.set('diffAttribute',this.get('original'));}	
		}else{this.set('diffAttribute',existingDiff);}
        
	    console.log('(FHIR-DATETIME) parent: '+this.get('parent')+', name: '+this.get('name')
		    +', original: '+this.get('original')+', diffAttribute: '+this.get('diffAttribute'));
	}.on('init'),
	calculatedPatch: function () {
	    console.log('(FHIR-DATETIME) diffAttribute altered, diffAttribute is: '+this.get('diffAttribute')+' and original is: '+this.get('original'));
	    if(this.get('diffAttribute') !== null && this.get('diffAttribute') !== undefined &&
		    this.get('original') !== this.get('diffAttribute')){
		    var diff = this.get('patcher').diff_main(
			    (this.get('original') !== null && this.get('original') !== undefined) ? this.get('original') : ''
				,this.get('diffAttribute'),true);
            this.get('parent').set(this.get('name')+'Diff',this.get('diffAttribute'));
	        return this.get('patcher').diff_prettyHtml(diff);
		}
		return '';
    }.property('diffAttribute'),
    actions: {
        cancel: function () {
		    this.set('diffAttribute',
			    (this.get('original') !== null && this.get('original') !== undefined) ? this.get('original') : '');
        },
		modalToggle: function(){
		    this.set('showModal',!this.get('showModal'));
		}
    }
});