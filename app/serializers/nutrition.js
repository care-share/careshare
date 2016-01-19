import NutritionOrder from 'ember-fhir-adapter/serializers/nutrition-order';

let NutritionOrderSerializer = NutritionOrder.extend({
    attrs: {
        nominations:  {embedded: 'always'}
    }

});

export default NutritionOrderSerializer;
