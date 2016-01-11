import model from 'ember-fhir-adapter/models/procedure-request';
import diffProp from 'careshare/properties/diff-property';
import DS from 'ember-data';
import Ember from 'ember';

export default model.extend({
    // code is extended from codeable-concept, which has its own diffProp
    statusDiff: diffProp('status'),
    priorityDiff: diffProp('priority'),
    orderedOnDiff: diffProp('orderedOn')
});