import model from 'ember-fhir-adapter/models/nutrition-order';
import diffProp from 'careshare/properties/diff-property';

export default model.extend({
    supplement.firstObject.productNameDiff: diffProp('supplement.firstObject.productName'),
    statusDiff: diffProp('status'),
    //supplement.firstObject.type.text is extended from codeable-concept, which has its own diffProp
    supplement.firstObject.instructionDiff: diffProp('supplement.firstObject.instruction'),
    dateTimeDiff: diffProp('dateTime')
});