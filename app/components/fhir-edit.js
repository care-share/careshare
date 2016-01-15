import PassthroughComponent from 'careshare/components/passthrough-component';


export default PassthroughComponent.extend({
    tagName: 'span',
	patcher: new diff_match_patch(),
    classNames: ['fhir-edit'],
    originalValue: '',
    setup: function () {

        console.log('(FHIR-EDIT) parent: '+this.get('parent')+', name: '+this.get('name')+', original:');
        //Get a string representation of the ORIGINAL property
        var sanitizedValue = this.get('parent').get(this.get('name')) ? this.get('parent').get(this.get('name')) : '';
        this.set('originalValue', sanitizedValue);


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

		}
	}
});