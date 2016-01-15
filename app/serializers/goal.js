import Goal from 'ember-fhir-adapter/serializers/goal';

let GoalSerializer = Goal.extend({
    attrs: {
        nominations:  {embedded: 'always'}
    },
    normalize: function (type, hash, prop) {
        let queryParam = `?goal:Goal=${hash.id}`;
        (hash.content || hash)['links'] = {
            carePlans: `/CarePlan${queryParam}`
        };
        return this._super(type, hash, prop);
    }

});

export default GoalSerializer;
