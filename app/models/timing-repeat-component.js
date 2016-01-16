import model from 'ember-fhir-adapter/models/timing-repeat-component';
import DS from 'ember-data';

export default model.extend({
    displayCode: function() {
	var frequency = this.get("frequency");
	var frequencyMax = this.get("frequencyMax");
	var period = this.get("period");
	var periodMax = this.get("periodMax");
	var periodUnits = this.get("periodUnits");
	var when = this.get("when");
	var encodedPattern;
        if (!frequency || (frequency == 1 && !frequencyMax)) {
	    if (period) {
		// frequency is 1 or not set, but we have a period.
		// construct a period-based code.
		var encodedPeriod;
		switch(period) {
		case 1: // e.g. QD
		    encodedPeriod = "";
		    break;
		case 2: // e.g. QOW
		    encodedPeriod = "O";
		    break;
		default: // e.g. Q6H
		    encodedPeriod = period.toString()
		}
		encodedPattern = "Q" + encodedPeriod;
	    }
	} else if (!period || period == 1) {
	    if (frequency) {
		// period is 1 or not set, but we have a frequency.
		// construct a frequency-based code.
		var encodedFrequency;
		if (frequencyMax) {
		    // range frequency
		    encodedFrequency = frequency.toString() + "-" + frequencyMax.toString();
		} else {
		    switch(frequency) {
		    case 1:
			// We should never end up here! should be covered in the period-based codes
			break;
		    case 2: // e.g. BID, BIW
			encodedFrequency = "B"
			break;
		    case 3: // e.g. TID, TIW
			encodedFrequency = "T"
			break;
		    case 4:
			encodedFrequency = "Q"
			break;
		    default:
			encodedFrequency = frequency.toString()
		    }
		    encodedPattern = encodedFrequency + "I";
		}
	    }
	}

	if (encodedPattern && periodUnits) {
	    return encodedPattern + periodUnits;
	} else {
	    return "DETAILS";
	}
	    
	    
    }.property('frequency', 'frequencyMax', 'period', 'periodMax', 'when')
});
