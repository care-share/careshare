import patient from 'ember-fhir-adapter/models/patient';
import DS from 'ember-data';
import Ember from 'ember';
import commProps from 'careshare/properties/comm-properties';

export default patient.extend({
    doLazyLoad: false,
    fullName: Ember.computed('name', function () {
        let firstHumanName = this.get('name');
        if (firstHumanName) {
            return `${firstHumanName.get('firstObject.family')}, ${firstHumanName.get('firstObject.given')}`;
        }
        return 'Unknown';
    }),
    conditions: DS.hasMany('condition', {'async': true}),
    carePlans: DS.hasMany('care-plan', {'async': true}),
    lazyCarePlans: function () {
        // wait until doLazyLoad is set to true
        // this is triggered by mousing over or clicking this model in the template
        // the click trigger is a fallback in case mouseover doesn't get triggered (e.g. mobile devices)
        if (!this.get('doLazyLoad')) {
            return [];
        }
        // if doLazyLoad is true, then get carePlans (which will trigger a REST query)
        return this.get('carePlans');
    }.property('doLazyLoad'),
    // communication properties
    comms: commProps.comms,
    unreadCount: commProps.unreadCount
});
