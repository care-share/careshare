import base from 'careshare/routes/base';

export default base.extend({
    model: function (/*params*/) {
        // we can't access parameters of parent routes directly to find the patient_id
        // instead, access the model provided by the parent route
        var patient_id = this.modelFor('patient').id;
        // now, query the CareAuth API for medrecs for this patient!
        return this.store.query('medpair', {patient_id: patient_id});
    },
    actions: {}
});
