import Ember from 'ember';
import API from '../api';

export default Ember.Route.extend({
    setupController: function (controller) {
        API.roles(this.get('session.secure'), controller);
        API.unapproved(this.get('session.secure'), controller);
        API.approved(this.get('session.secure'), controller);
    },
    actions: {
        reset: function (controller) {
            API.unapproved(this.get('session.secure'), controller);
            API.approved(this.get('session.secure'), controller);
        },
        approve: function (email, session, controller) {
            console.log('approve(route) called');
            API.approve(email, session, controller);
        },
        deny: function (email, session, controller) {
            console.log('deny(route) called');
            API.deny(email, session, controller);
        },
        addRole: function (email, role, session, controller) {
            console.log('add role(route) called');
            API.addRole(email, role, session, controller);
        },
        removeRole: function (email, role, session, controller) {
            console.log('remove role(route) called');
            API.removeRole(email, role, session, controller);
        }
    }
});
