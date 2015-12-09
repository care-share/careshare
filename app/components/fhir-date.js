import Ember from 'ember';
export default Ember.Component.extend({
    classNames: ['fhir-date'],
    originalValue: '',
	displayDate: '',
	isObserving: true,
	setup: function () {
	    console.log('FHIR-DATE: init');
		this.set('originalValue',this.get('attribute'));
		this.send('dateFormat');
	}.on('init'),
	change: function () {
		console.log('FHIR-DATE: changed to '+this.get('attribute'));
		if(this.get('isObserving') === true){
			this.set('isObserving',false);
			this.set('originalValue',new Date(Ember.Date.parse(this.get('attribute'))));	
			this.send('dateFormat');
			this.set('isObserving',true);
		}
	}.observes('attribute'),
    actions: {
        cancel: function () {
            console.log('FHIR-DATE: cancel');
            this.set('attribute', this.get('originalValue'));
			this.send('dateFormat');
        },
		dateFormat: function(){
		    console.log('FHIR-DATE: format attribute ('+this.get('originalValue')+')');
			if(this.get('originalValue')){
	            var date = new Date(Ember.Date.parse(this.get('originalValue')));
				if(Number.isNaN(date.getUTCFullYear())){
				    this.set('displayDate','');
				}else{
                    this.set('displayDate', date.getUTCFullYear() + '-' + 
		             (date.getUTCMonth() + 1 < 10 ? '0' : '') + (date.getUTCMonth() + 1) + '-' + date.getUTCDate());
			         console.log('FHIR-DATE: displayDate is now ('+this.get('displayDate')+')');
				}
			}
			else
				this.set('displayDate', '(None)');
	    }
    }
});
