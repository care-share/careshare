import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['fhir-workspace-wrapper'], // apply this style to the div 'ember-view' wrapper element for this component
    actions: {
        addToWorkspace: function (draggedObject/*, options*/) {
            var draggedModel = draggedObject._internalModel.modelName;
            console.log(`addToWorkspace called for ${draggedModel}`);
        }
    }
});
