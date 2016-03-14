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
    dest: DS.hasMany('comm-dest', {embedded: true}),

    // Communication has text content
    content: DS.attr('string'),

    // Communication is sent at a specific date/time
    timestamp: DS.attr('date'),

    /////////////////////////////////////////////
    // COMPUTED PROPERTIES
    session: Ember.inject.service('session'), // needed for ember-simple-auth

    // gets/sets whether the currently logged-in user has seen this communication
    hasSeen: Ember.computed('dest', {
        get(/*key*/) {
            let userId = this.get('session.data.authenticated._id');
            let destUser = this.get('dest').findBy('user_id', userId);
            if (!destUser) {
                // dest user was not found
                return false;
            }
            return destUser.get('seen') === true;
        },
        set(key, value) {
            let userId = this.get('session.data.authenticated._id');
            let destUser = this.get('dest').findBy('user_id', userId);
            if (!destUser) {
                // dest user was not found
                return false;
            }

            if (destUser) {
                // if this user is in the map of destinations for this comm, set the 'seen' value
                destUser.set('seen', value);
            } else {
                // otherwise, add this user to the map of destinations for this comm, and set the 'seen' value
                let obj = {user_id: userId, seen: value};
                destUser = this.store.createRecord('comm-dest', obj);
                this.get('dest').addObject(destUser);
            }
        }
    }),

    parsedTimestamp: Ember.computed('timestamp', {
        get(/*key*/) {
            var result = new Date(Ember.Date.parse(this.get('timestamp')));
            return (("0" + (result.getMonth() + 1)).slice(-2) + '/' + ("0" + result.getDate()).slice(-2) + '/' + result.getFullYear() + ' '
            + ((result.getHours() > 12) ? (result.getHours() - 12) : (("0" + result.getHours()).slice(-2))) + ":" + ("0" + result.getMinutes()).slice(-2) +
            ((result.getHours() > 12) ? ' PM' : ' AM')).replace("00:00 AM", "")
        },
        set(key, value) {
            //This shouldn't happen
        }
    })
});
