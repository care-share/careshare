import DS from 'ember-data';
import Ember from 'ember';

// adapted from http://stackoverflow.com/questions/12168570/how-to-represent-arrays-within-ember-data-models
export default DS.Transform.extend({
    deserialize: function (serialized) {
        return (Ember.typeOf(serialized) === 'array') ? serialized : [];
    },
    serialize: function (deserialized) {
        return (Ember.typeOf(deserialized) === 'array') ? deserialized : [];
    }
});
