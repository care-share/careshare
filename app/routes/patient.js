import base from 'careshare/routes/base';

export default base.extend({
    model: function (params) {
        var controller = this.controllerFor('patient');
        controller.set('id', params.patient_id);
        return this.store.find('patient', params.patient_id);
    },
    actions: {}
});
