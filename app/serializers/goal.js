import Goal from 'ember-fhir-adapter/serializers/goal';

let GoalSerializer = Goal.extend({
    attrs: {
        nominations:  {embedded: 'always'}
    },
    normalize: function (type, hash, prop) {
        let queryParam = `?goal=${hash.id}`;
        (hash.content || hash)['links'] = {
            carePlan: `/CarePlan${queryParam}`
        };
        return this._super(type, hash, prop);
    }

});

export default GoalSerializer;
