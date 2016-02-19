import base from 'careshare/routes/base';
import API from '../api';

export default base.extend({
    setupController: function (controller) {
        API.roles(this.get('session.data.authenticated'), controller);
        API.unapproved(this.get('session.data.authenticated'), controller);
        API.approved(this.get('session.data.authenticated'), controller);
    },
    actions: {
        reset: function (controller) {
            API.unapproved(this.get('session.data.authenticated'), controller);
            API.approved(this.get('session.data.authenticated'), controller);
        },
        approve: function (id, session, controller) {
            console.log('approve(route) called');
            API.approve(id, session, controller);
        },
        deny: function (id, session, controller) {
            console.log('deny(route) called');
            API.deny(id, session, controller);
        },
        addRole: function (id, role, session, controller) {
            console.log('add role(route) called');
            API.addRole(id, role, session, controller);
        },
        removeRole: function (id, role, session, controller) {
            console.log('remove role(route) called');
            API.removeRole(id, role, session, controller);
        }
    }
});
