import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['fhir-datetime'],
    originalValue: '',
	displayDate: '',
	isObserving: true,
	setup: function () {
	    console.log('FHIR-DATETIME: init');
		this.set('originalValue',this.get('attribute'));
		this.send('dateFormat');
	}.on('init'),
	change: function () {
		console.log('FHIR-DATETIME: changed');
		if(this.get('isObserving') === true){
			this.set('isObserving',false);
			this.set('originalValue',new Date(Ember.Date.parse(this.get('displayDate'))));	
			this.send('dateFormat');
			this.set('isObserving',true);
		}
	}.observes('displayDate'),
    actions: {
        cancel: function () {
            console.log('FHIR-DATETIME: cancel');
            this.set('attribute', this.get('originalValue'));
			this.send('dateFormat');
        },
		dateFormat: function(){
		    console.log('FHIR-DATETIME: format attribute ('+this.get('attribute')+')');
			if(this.get('attribute')){
	            var date = new Date(Ember.Date.parse(this.get('attribute')));
				this.set('displayDate', date.getUTCFullYear() + '-' + 
			    (date.getUTCMonth() + 1 < 10 ? '0' : '') + (date.getUTCMonth() + 1) + '-' + date.getUTCDate() 
				+ 'T' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds());
			    console.log('FHIR-DATETIME: displayDate is now ('+this.get('displayDate')+')');
			}
			else
				this.set('displayDate', '(None)');
	    }
    }
});