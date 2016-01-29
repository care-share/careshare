import model from 'ember-fhir-adapter/models/timing';
import DS from 'ember-data';

export default model.extend({
    // TODO: this is a temporary fix, remove it when our pull request for the ember-fhir-adapter is accepted
    event: DS.attr('date-array')
});
