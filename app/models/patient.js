import patient from 'ember-fhir-adapter/models/patient';
import DS from 'ember-data';
import Ember from 'ember';

export default patient.extend({
    fullName: Ember.computed('name', function () {
        let firstHumanName = this.get('name');
        if (firstHumanName) {
            return `${firstHumanName.get('firstObject.family')}, ${firstHumanName.get('firstObject.given')}`;
        }
        return 'Unknown';
    }),
    conditions: DS.hasMany('condition', {'async': true})
});
