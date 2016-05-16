import CarePlanResource from 'careshare/controllers/careplan/resource';
import Ember from 'ember';

export default CarePlanResource.extend({
    session: Ember.inject.service('session'),
    needs: 'careplan',
    careplan: Ember.computed.alias('controllers.careplan'),
    resources: [],
    actions: {
        addToWorkspace: function (draggedObject/*, options*/) {
            var draggedModel = draggedObject._internalModel.modelName;
            console.log(`addToWorkspace called for ${draggedModel}`);
            this.get('resources').addObject(draggedObject);
            console.log(this.get('careplan'));
        }
    }
});
