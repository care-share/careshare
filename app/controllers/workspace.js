import CarePlanResource from 'careshare/controllers/careplan/resource';
import Ember from 'ember';

export default CarePlanResource.extend({
    session: Ember.inject.service('session'),
    needs: 'careplan',
    careplan: Ember.computed.alias('controllers.careplan'),
    resources: [],
    actions: {
        addToWorkspace: function (draggedObject/*, options*/) {
            this.get('resources').addObject(draggedObject);
        },
        hoverOn: function (model) {
            this.get('careplan').send('hoverOn', model);

        },
        hoverOff: function (/*model*/) {
            this.get('careplan').send('hoverOff');
        }
    }
});
