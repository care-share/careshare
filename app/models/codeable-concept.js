import model from 'ember-fhir-adapter/models/codeable-concept';
import diffProp from 'careshare/properties/diff-property';

export default model.extend({
    textDiff: diffProp('text')
});