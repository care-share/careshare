import DS from 'ember-data';
import Ember from 'ember';

// adapted from:
// http://stackoverflow.com/questions/12168570/how-to-represent-arrays-within-ember-data-models
// https://github.com/emberjs/data/blob/v2.3.0/addon/-private/transforms/date.js
export default DS.DateTransform.extend({
    deserialize: function (serialized) {
        var result = [];
        if (Ember.typeOf(serialized) === 'array') {
            result = serialized.map(function (item/*, index, enumerable*/) {
                // deserialize each array element as a Date
                return this._super(item);
            }, this).filter(filterInvalid);
        }
        return result;
    },
    serialize: function (deserialized) {
        var result = [];
        if (Ember.typeOf(deserialized) === 'array') {
            result = deserialized.map(function (item/*, index, enumerable*/) {
                // serialize each array element as a String
                return this._super(item);
            }, this).filter(filterInvalid);
        }
        return result;
    }
});

function filterInvalid(item/*, index, enumerable*/) {
    // filter out any invalid elements
    return item !== null;
}
