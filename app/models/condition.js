import model from 'ember-fhir-adapter/models/condition';
import diffProp from 'careshare/properties/diff-property';
import DS from 'ember-data';
import Ember from 'ember';

export default model.extend({
    displayName: Ember.computed('name', function () {
        // There might be multiple codings, but we only want one
        // human readable display name, so we just take it from the
        // first coding we find. If the business need changes, this
        // is where to implement the change.
        return this.get('code.coding.firstObject.display');
    }),
    conditions: DS.hasMany('condition', {'async': true})
});