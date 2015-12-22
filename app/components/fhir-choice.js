import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'span',
	original: '',
	selectedChoice: '',
	calculatedPatch: function(){
	    console.log('fhir-choice recalc selectedChoice: '+this.get('selectedChoice')+',original:'+this.get('original'));	
        console.log('fhir-choice attribute type: '+typeof(this.get('attribute'))+
		',selectedChoice type: '+typeof(this.get('selectedChoice')));
		try{this.set('attribute',this.get('selectedChoice'));}catch(err){console.log('ERROR fhir-choice: '+err);}
	    console.log('fhir-choice attribute is now: '+this.get('attribute'));
	    return (this.get('selectedChoice') === this.get('original')) ? '' :
		    '\<ins style=\'background:#e6ffe6\'\>'+this.get('selectedChoice')+'\<\/ins\>';
	}.property('selectedChoice'),
    classNames: ['fhir-choice'],
    finalChoices: [],
    setup: function () {
	    this.set('finalChoices', this.get('choices').split(','));
        this.set('selectedChoice',this.get('attribute') === undefined ?
		    this.get('finalChoices')[0] : this.get('attribute'));
	    this.set('original',this.get('selectedChoice'));
		console.log('INIT: FHIR-CHOICE- attribute: ' + this.get('attribute'));	
    }.on('init'),
	actions:{
	    cancel: function(){
		    console.log('fhir-choice cancel: current-'+this.get('attribute')+',new- '+this.get('original'));
		    this.set('selectedChoice',this.get('original'));
		}
	}
});