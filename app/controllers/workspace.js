import CarePlanResource from 'careshare/controllers/careplan/resource';
import Ember from 'ember';

export default CarePlanResource.extend({
    session: Ember.inject.service('session'),
    needs: 'careplan',
    careplan: Ember.computed.alias('controllers.careplan'),
    resources: [],
    isFull: Ember.computed('resources.[]', function() {
        // This is not working -- this.get('resources').length always returns 0. why???
        return (this.get('resources').length >= 3);
    }),
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
