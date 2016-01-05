import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'span',
    classNames: ['fhir-object-select'],
   //  compSelection: function() {
	  //  	return this.get('parent').get(this.get('localVariable'));
  	// }.property('parent', 'localVariable'),
    setup: function () {
    }.on('init'),
    actions: {
        changed: function (input) {
        	if (input === 'none'){
        		this.get('parent').set(this.get('variable'), '');
        	}
        	else {
		        var reference = this.get('parent').store.createRecord('reference', {
		            reference: input
		        });

		        console.log(reference)
		        this.get('parent').set(this.get('variable'), reference);
		        var inputsplit = input.split('/');
		        this.get('parent').set(this.get('localVariable'), this.get('parent').store.peekRecord(inputsplit[0], inputsplit[1]));
		        // if (isListAttribute) { // for reference attributes with any allowed length
		        //     var references = referringObject.get(attributeName)
		        //         .toArray();
		        //     // TODO: should add logic to check if the reference already exists
		        //     // We end up adding duplicates, but that won't break anything for now
		        //     references.addObject(reference);
		        //     referringObject.set(attributeName, references);
		        // } else { // for reference attributes that allow only one value
		        //     referringObject.set(attributeName, reference);
		        // }
		        // console.log(referringObject);
		        // referringObject.save();
		    }
        }
    }
});