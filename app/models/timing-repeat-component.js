import model from 'ember-fhir-adapter/models/timing-repeat-component';

export default model.extend({
    displayText: function () { // spelled out summary of the repeat pattern
        var frequency = this.get('frequency');
        var frequencyMax = this.get('frequencyMax');
        var period = this.get('period');
        var periodMax = this.get('periodMax');
        var periodUnits = this.get('periodUnits');
        //var when = this.get('when');
        var string = null;
        //if (!frequency && !period) {
        if (!frequency || !period || !periodUnits) {
            string = null;
        } else {
            string = frequency.toString();
            if (frequencyMax) {
                string = string + '-' + frequencyMax.toString();
            }
            string = string + ' times every ';
            string = string + period.toString();
            if (periodMax) {
                string = string + '-' + periodMax.toString();
            }
            string = string + ' ' + periodUnits.toUpperCase();
        }
        return string;
        //}.property('frequency', 'frequencyMax', 'period', 'periodMax', 'when'),
    }.property('frequency', 'frequencyMax', 'period', 'periodMax', 'periodUnits'),
    displayCode: function () { // short code of the repeat pattern, falls back to displayText if it's not encodable
        var frequency = this.get('frequency');
        var frequencyMax = this.get('frequencyMax');
        var period = this.get('period');
        var periodMax = this.get('periodMax');
        var periodUnits = this.get('periodUnits');
        //var when = this.get('when');
        var encodedPattern;
        // FIXME: don't use a "truthy" comparison (use ===)
        if (!frequency || (frequency == 1 && !frequencyMax)) {
            if (period) {
                // frequency is 1 or not set, but we have a period.
                // construct a period-based code.
                var encodedPeriod;
                if (periodMax) {
                    // range period
                    encodedPeriod = period.toString() + '-' + periodMax.toString();
                } else {
                    switch (period) {
                        case 1: // e.g. QD
                            encodedPeriod = '';
                            break;
                        case 2: // e.g. QOW
                            encodedPeriod = 'O';
                            break;
                        default: // e.g. Q6H
                            encodedPeriod = period.toString();
                    }
                }
                encodedPattern = 'Q' + encodedPeriod;
            }
            // FIXME: don't use a "truthy" comparison (use ===)
        } else if (!period || (period == 1 && !periodMax)) {
            if (frequency) {
                // period is 1 or not set, but we have a frequency.
                // construct a frequency-based code.
                var encodedFrequency;
                if (frequencyMax) {
                    // range frequency
                    encodedFrequency = frequency.toString() + '-' + frequencyMax.toString();
                } else {
                    switch (frequency) {
                        case 1:
                            // We should never end up here! should be covered in the period-based codes
                            break;
                        case 2: // e.g. BID, BIW
                            encodedFrequency = 'B';
                            break;
                        case 3: // e.g. TID, TIW
                            encodedFrequency = 'T';
                            break;
                        case 4:
                            encodedFrequency = 'Q';
                            break;
                        default:
                            encodedFrequency = frequency.toString();
                    }
                }
                encodedPattern = encodedFrequency + 'I';
            }
        }

        if (encodedPattern && periodUnits) { // either we've figured out a way to encode this
            return (encodedPattern + periodUnits).toUpperCase();
        } else { // or we fall back to the verbose version
            return this.get('displayText');
        }
        //}.property('frequency', 'frequencyMax', 'period', 'periodMax', 'when')
    }.property('frequency', 'frequencyMax', 'period', 'periodMax', 'periodUnits')
});
