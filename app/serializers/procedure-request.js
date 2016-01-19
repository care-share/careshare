import Goal from 'ember-fhir-adapter/serializers/procedure-request';

let ProcedureRequestSerializer = ProcedureRequest.extend({
    attrs: {
        nominations:  {embedded: 'always'}
    }

});

export default ProcedureRequestSerializer;
