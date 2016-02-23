import CarePlanResource from 'careshare/controllers/careplan/resource';
import Ember from 'ember';

export default CarePlanResource.extend({
    session: Ember.inject.service('session'),
    needs: "careplan",
    careplan: Ember.computed.alias("controllers.careplan"),
    // define the "CarePlan -> <model>" relationship for this controller's model
    isPhysician: function () {
        var sessionRoles = this.get('session.data.authenticated.roles');
        if (sessionRoles && sessionRoles.indexOf('physician') > -1) {
            return true;
        }
        return false;
    }.property('session')
});
