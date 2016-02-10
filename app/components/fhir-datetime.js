import Ember from 'ember';
import PassthroughComponent from 'careshare/components/passthrough-component';

export default PassthroughComponent.extend({
    patcher: new diff_match_patch(),
    classNames: ['fhir-datetime'],
    showModal: false,
    originalValue: '',
    isArray: false, // is this used for a single object or an array of objects?
    setup: function () {
        // Creates a computed property that converts date strings to Date objects
        Ember.defineProperty(this, 'datePassthrough', Ember.computed({
            // this.array is a boolean that determines if this is component modifies a regular attribute, or an array attribute that will contain a single datetime
            get(key) {
                var result;
                var passthrough = this.get('passthrough');
                if (this.get('isArray')) {
                    if (passthrough && passthrough.length > 0) {
                        result = passthrough[0];
                    }
                } else {
                    result = passthrough;
                }
                console.log('datePassthrough get result: ' + result);
                if (result === null || result === undefined)
                    return result;
                ;
                var resultDate = (("0" + (result.getMonth() + 1)).slice(-2) + '/' + ("0" + result.getDate()).slice(-2) + '/' + result.getFullYear() + ' '
                + ((result.getHours() > 12) ? (result.getHours() - 12) : (("0" + result.getHours()).slice(-2))) + ":" + ("0" + result.getMinutes()).slice(-2) +
                ((result.getHours() > 12) ? ' PM' : ' AM')).replace("00:00 AM", "");
                console.log('datePassthrough resultDate: ' + resultDate);
                return resultDate;
            },
            set(key, value) {
                var result = new Date(Ember.Date.parse(value));
                console.log('datePassthrough set value: ' + value + ',result: ' + result);
                this.set('passthrough', this.get('isArray') ? [result] : result);
                return (("0" + (result.getMonth() + 1)).slice(-2) + '/' + ("0" + result.getDate()).slice(-2) + '/' + result.getFullYear() + ' '
                + ((result.getHours() > 12) ? (result.getHours() - 12) : (("0" + result.getHours()).slice(-2))) + ":" + ("0" + result.getMinutes()).slice(-2) +
                ((result.getHours() > 12) ? ' PM' : ' AM')).replace("00:00 AM", "");
            }
        }).property('passthrough'));

        //Get a string representation of the ORIGINAL property
        var attr = this.get('parent').get(this.get('name'));
        var sanitizedValue = attr ? attr : '';
        this.set('originalValue', sanitizedValue);

        //Define computed property in setup because the attribute name has to be set dynamically
        Ember.defineProperty(this, 'calculatedPatch', Ember.computed(function () {
            //Get a string representation of the CURRENT property
            var attr = this.get('parent').get(this.get('name'));
            var sanitizedValue = attr ? attr : '';

            // If there is a difference between the original and current create the Diff
            if (this.get('originalValue') !== sanitizedValue) {
                var diff = this.get('patcher').diff_main(
                    new Date(Ember.Date.parse(this.get('originalValue'))).toString(),
                    new Date(Ember.Date.parse(sanitizedValue)).toString(),
                    true
                );
                if (diff.toString().indexOf('Invalid Date') === -1) {
                    return this.get('patcher').diff_prettyHtml(diff);
                }
            }
            //If not return empty (Handlebars checks for empty string before creating DIV)
            return "";
        }).property('parent.' + this.get('name')));
    }.on('init'),
    actions: {
        cancel: function () {
        },
        modalToggle: function () {
            this.set('showModal', !this.get('showModal'));
        }
    }
});
