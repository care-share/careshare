import model from 'ember-fhir-adapter/models/nutrition-order-supplement-component';
import diffProp from 'careshare/properties/diff-property';

export default model.extend({
    productNameDiff: diffProp('productName'),
    // type.text is extended from codeable-concept, which has its own diffProp
    instructionDiff: diffProp('instruction')
});
