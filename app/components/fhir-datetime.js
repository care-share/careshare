import Ember from 'ember';
import PassthroughComponent from 'careshare/components/passthrough-component';

export default PassthroughComponent.extend({
	patcher: new diff_match_patch(),
  classNames: ['fhir-datetime'],
	showModal: false,
  originalValue: '',
	setup: function () {
		    //this.set('passthrough',new Date(Ember.Date.parse(this.get('passthrough'))));
	    	//this.set('datePassthrough',new Date(Ember.Date.parse(this.get('passthrough'))));
		    var attribute;
				if(this.get('name')){
					attribute = this.get('parent').get(this.get('name'));
				}else{
					attribute = this.get('parent');
				}
    		//Creates a computed property that converts date strings to Date objects
    		Ember.defineProperty(this, 'datePassthrough', Ember.computed(function(key, value) {
            // Set parent variable when passthrough is edited externally
            if (arguments.length > 1) {
							this.set('passthrough', new Date(Ember.Date.parse(value)));
            }

            // Sets passthrough to this when property changes
						console.log('datePassthrough init, passthrough: '+this.get('passthrough'));
						var date = new Date(this.get('passthrough'));
            return (("0"+(date.getMonth()+1)).slice(-2)+'/'+("0" + date.getDate()).slice(-2)+'/'+date.getFullYear()+' '
									+((date.getHours() > 12)?(date.getHours()-12):(("0" + date.getHours()).slice(-2))) + ":" + ("0" + date.getMinutes()).slice(-2) +
									((date.getHours() > 12)?' PM':' AM')).replace("00:00 AM","");
        }).property('passthrough'));

        //Get a string representation of the ORIGINAL property
        var sanitizedValue = attribute ? attribute : '';
        this.set('originalValue', sanitizedValue);


        //Define computed property in setup because the attribute name has to be set dynamically
        Ember.defineProperty(this, 'calculatedPatch', Ember.computed(function() {
                //Get a string representation of the CURRENT property
                var sanitizedValue = attribute ? attribute : '';

                // If there is a difference between the original and current create the Diff
                if (this.get('originalValue') !== sanitizedValue){
                    var diff = this.get('patcher').diff_main(
                        new Date(Ember.Date.parse(this.get('originalValue'))).toString(),
                        new Date(Ember.Date.parse(sanitizedValue)).toString(),
                        true
                    );
                    if(diff.toString().indexOf('Invalid Date') === -1){
                        return this.get('patcher').diff_prettyHtml(diff);
                    }
                }
                //If not return empty (Handlebars checks for empty string before creating DIV)
                return "";
        }).property(this.get('name')?('parent.' + this.get('name')):'parent')
			);

    console.log('fhir-datetime init finished');
    }.on('init'),
    actions: {
        cancel: function () {
        },
		modalToggle: function(){
		    this.set('showModal',!this.get('showModal'));
		}
    }
});
