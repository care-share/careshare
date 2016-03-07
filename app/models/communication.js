import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    // _id is automatically added by mongo
    _id: DS.attr('string'),

    // FHIR resources associated with this Communication
    // 'resource' is a CarePlan component... could be a Goal, Condition, etc.
    resource_id: DS.attr('string'),
    resource_type: DS.attr('string'),
    careplan_id: DS.attr('string'),
    patient_id: DS.attr('string'),

    // Communication is initiated by one user
    src_user_id: DS.attr('string'),

    // Communication is sent to multiple users; we keep track of who has seen it
    dest: DS.hasMany('communication-dest', {embedded: true}),

    // Communication has text content
    content: DS.attr('string'),

    // Communication is sent at a specific date/time
    timestamp: DS.attr('date'),

    /////////////////////////////////////////////
    // COMPUTED PROPERTIES
    session: Ember.inject.service('session'), // needed for ember-simple-auth

    // gets/sets whether the currently logged-in user has seen this communication
    hasSeen: Ember.computed('dest', function (key, value) {
        let userId = this.get('session.data.authenticated._id');
        let destUser = this.get('dest').findBy('user_id', userId);
        if (!destUser) {
            // dest user was not found
            return false;
        }

        if (arguments.length > 1) {
            // setter
            destUser.set('seen', value);
            //this.save();
        } else {
            // getter
            return destUser.get('seen') === true;
        }
    })
});
