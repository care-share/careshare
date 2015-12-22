import Ember from 'ember';
export default Ember.Component.extend({
    classNames: ['fhir-datetime'],
    originalValue: '',
	displayDate: '',
	isObserving: true,
	calculatedPatch: function(){
	    console.log('fhir-datetime recalc displayDate: '+this.get('displayDate')+',original:'+this.get('original'));	
	    return (this.get('displayDate') === this.get('original')) ? '' :
		    '\<ins style=\'background:#e6ffe6\'\>'+this.get('displayDate')+'\<\/ins\>';
	}.property('displayDate'),
	setup: function () {
	    console.log('FHIR-DATETIME: init');
		this.set('originalValue',this.get('attribute'));
		this.send('dateFormat');
	}.on('init'),
	change: function () {
		console.log('FHIR-DATETIME: changed to '+this.get('attribute'));
		if(this.get('isObserving') === true){
			this.set('isObserving',false);
			this.set('originalValue',new Date(Ember.Date.parse(this.get('attribute'))));	
			this.send('dateFormat');
			this.set('isObserving',true);
		}
	}.observes('attribute'),
    actions: {
        cancel: function () {
            console.log('FHIR-DATETIME: cancel');
            this.set('attribute', this.get('originalValue'));
			this.send('dateFormat');
			this.set('calculatedPatch','');
        },
		dateFormat: function(){
		    console.log('FHIR-DATETIME: format attribute ('+this.get('originalValue')+')');
			if(this.get('originalValue')){
	            var date = new Date(Ember.Date.parse(this.get('originalValue')));
				if(Number.isNaN(date.getUTCFullYear())){
				    this.set('displayDate','');
				}else{
				    this.set('displayDate', date.getUTCFullYear() + '-' + 
			         (date.getUTCMonth() + 1 < 10 ? '0' : '') + (date.getUTCMonth() + 1) + '-' + date.getUTCDate() + 'T' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds());
				}
				if(this.get('displayDate').indexOf('nvalid') > -1){this.set('attribute','');}
			    console.log('FHIR-DATETIME: displayDate is now ('+this.get('displayDate')+')');
			}
			else{
				this.set('displayDate', '(None)');
			}
			
	    }
    }
});