import DS from 'ember-data';
import Ember from 'ember';

// adapted from:
// http://stackoverflow.com/questions/12168570/how-to-represent-arrays-within-ember-data-models
// https://github.com/emberjs/data/blob/v2.3.0/addon/-private/transforms/date.js
export default DS.DateTransform.extend({
    deserialize: function (serialized) {
        var result = [];
        if (Ember.typeOf(serialized) === 'array') {
            result = serialized.map(mapToSuper, this).filter(filterInvalid);
        }
        return result;
    },
    serialize: function (deserialized) {
        var result = [];
        if (Ember.typeOf(deserialized) === 'array') {
            result = deserialized.map(mapToSuper, this).filter(filterInvalid);
        }
        return result;
    }
});

function mapToSuper (item/*, index, enumerable*/) {
    // deserialize each array element as a Date
    // serialize each array element as a String
    return this._super(item);
}

function filterInvalid (item/*, index, enumerable*/) {
    // filter out any invalid elements
    return item !== null;
}
