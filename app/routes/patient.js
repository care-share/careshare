import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    model: function (params) {
        var controller = this.controllerFor('patient');
        controller.set('id', params.patient_id);
        return this.store.find('patient', params.patient_id)
            .then(function (response) {
                if (response.get('gender')) {
                    controller.set('gender', response.get('gender')
                            .charAt(0)
                            .toUpperCase() +
                        response.get('gender')
                            .substr(1));
                }
                response.get('name')
                    .forEach(function (name) {
                        controller.set('firstName', name.get('given'));
                        controller.set('lastName', name.get('family'));
                    });
                controller.set('birthDate', response.get('birthDate'));
                return response;
            });
    },
    actions: {}
});
