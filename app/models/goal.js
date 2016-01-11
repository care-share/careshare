import model from 'ember-fhir-adapter/models/goal';
import diffProp from 'careshare/properties/diff-property';

export default model.extend({
    descriptionDiff: diffProp('description'),
    // priority is extended from codeable-concept, which has its own diffProp
    statusDiff: diffProp('status'),
    targetDateDiff: diffProp('targetDate')
});