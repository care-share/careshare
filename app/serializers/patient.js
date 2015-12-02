import Patient from 'ember-fhir-adapter/serializers/patient';

let PatientSerializer = Patient.extend({
    attrs: {
        name: {embedded: 'always'}
    },
    normalize: function (type, hash, prop) {
        let queryParam = `?patient:Patient=${hash.id}`;
        (hash.content || hash)['links'] = {
            carePlans: `/CarePlan${queryParam}`,
            conditions: `/Condition${queryParam}`,
            observations: `/Observation${queryParam}`,
            encounters: `/Encounter${queryParam}`,
            medications: `/MedicationStatement${queryParam}`,
            appointments: `/Appointment${queryParam}`,
            risks: `/RiskAssessment?subject:Patient=${hash.id}`
        };
        return this._super(type, hash, prop);
    }
});

export default PatientSerializer;
