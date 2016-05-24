import patient from 'ember-fhir-adapter/models/patient';
import DS from 'ember-data';
import Ember from 'ember';
import commProps from 'careshare/properties/comm-properties';

export default patient.extend({
    fullName: Ember.computed('name', function () {
        let firstHumanName = this.get('name');
        if (firstHumanName) {
            return `${firstHumanName.get('firstObject.family')}, ${firstHumanName.get('firstObject.given')}`;
        }
        return 'Unknown';
    }),
    birthDateFormatted: Ember.computed('birthDate', function () {
        let value = this.get('birthDate');
        let date = moment(value).format('MMM Do, YYYY');
        let age = moment().diff(value, 'years');
        return `${date} (${age} yrs old)`;
    }),
    birthDateOnlyFormatted: Ember.computed('birthDate', function () {
        let value = this.get('birthDate');
        let date = moment(value).format('MMM Do, YYYY');
        let age = moment().diff(value, 'years');
        return `${date}`;
    }),
    ageFormatted: Ember.computed('birthDate', function () {
        let value = this.get('birthDate');
        let date = moment(value).format('MMM Do, YYYY');
        let age = moment().diff(value, 'years');
        return `${age} Years Old`;
    }),
    genderFormatted: Ember.computed('gender', function () {
        let gender = this.get('gender');
        return gender.charAt(0).toUpperCase() + gender.substr(1);
    }),
    conditions: DS.hasMany('condition', {'async': true}),
    carePlans: Ember.computed(function () {
        let reference = 'Patient/' + this.get('id');
        return this.store.peekAll('care-plan').filterBy('subject.reference', reference, {live: true});
    }),
    hasNominations: DS.attr('boolean'),
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount
});
