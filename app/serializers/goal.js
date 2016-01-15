import Goal from 'ember-fhir-adapter/serializers/goal';

let GoalSerializer = Goal.extend({
    attrs: {
        nominations:  {embedded: 'always'}
    }

});

export default GoalSerializer;
