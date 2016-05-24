import CarePlanResource from 'careshare/controllers/careplan/resource';

export default CarePlanResource.extend({
    // define the "CarePlan -> <model>" relationship for this controller's model
    isPhysician: function () {
        var sessionRoles = this.get('session.data.authenticated.roles');
        if (sessionRoles && sessionRoles.indexOf('physician') > -1) {
            return true;
        }
        return false;
    }.property('session')
});
