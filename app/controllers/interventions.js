import CarePlanResource from 'careshare/controllers/careplan/resource';

export default CarePlanResource.extend({	
  	needs: "careplan",
    careplan: Ember.computed.alias("controllers.careplan"),
    // define the "CarePlan -> <model>" relationship for this controller's model
    carePlanRefAttr: 'activity'
});
