import model from 'ember-fhir-adapter/models/medication-order-dosage-instruction-component';
import diffProp from 'careshare/properties/diff-property';

export default model.extend({
    textDiff: diffProp('text')
});
