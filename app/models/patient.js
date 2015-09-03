import patient from 'ember-fhir-adapter/models/patient';


export default patient.extend({ 

    fullName: Ember.computed("name", function(){
	let firstHumanName = this.get("name");
	if (firstHumanName) {
	    return `${firstHumanName.get('firstObject.family')}, ${firstHumanName.get('firstObject.given')}`;
	}
	return "Unknown";
    })

});