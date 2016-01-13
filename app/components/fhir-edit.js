import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
	diffAttribute: null,
	original: null,
	patcher: new diff_match_patch(),
    classNames: ['fhir-edit'],
    originalValue: '',
    setup: function () {

        console.log('(FHIR-EDIT) parent: '+this.get('parent')+', name: '+this.get('name')+', original:');
        //Get a string representation of the ORIGINAL property
        var sanitizedValue = this.get('parent').get(this.get('name')) ? this.get('parent').get(this.get('name')) : '';
        this.set('originalValue', sanitizedValue);

        // Does not work even though it returns the computed property and not the evaluation
        // this.set('passthrough', this.get('parent')[this.get('name')])

        //Creates a computed property that acts as a pass though from inner component to actual parent model
        Ember.defineProperty(this, 'passthrough', Ember.computed(function(key, value) {
                // Set parent variable when passthrough is edited externally
                if (arguments.length > 1) {
                    this.get('parent').set(this.get('name'), value);
                }
                // Sets passthrough to this when property changes
                return this.get('parent.' + this.get('name'));
            }).property('parent.' + this.get('name')));


        //Define computed property in setup because the attribute name has to be set dynamically
        Ember.defineProperty(this, 'calculatedPatch', Ember.computed(function() {
                //Get a string representation of the CURRENT property
                var sanitizedValue = this.get('parent').get(this.get('name')) ? this.get('parent').get(this.get('name')) : '';

                // If there is a difference between the original and current create the Diff
                if (this.get('originalValue') !== sanitizedValue){
                    var diff = this.get('patcher').diff_main(this.get('originalValue'),sanitizedValue,true);
                    return this.get('patcher').diff_prettyHtml(diff);
                }
                //If not return empty (Handlebars checks for empty string before creating DIV)
                else{
                    return ""
                }
            }).property('parent.' + this.get('name')));


    }.on('init'),
	actions:{
	    cancel: function(){
		    this.set('diffAttribute',
			    (this.get('original') !== null && this.get('original') !== undefined) ? this.get('original') : '');
		}
	}
});