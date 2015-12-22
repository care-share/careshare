import Ember from 'ember';

export default Ember.Controller.extend({
    needs: 'careplan',
    patient: Ember.computed.alias('controllers.careplan'),
    expandGoals: false,
    expandProblems: false,
    expandNutrition: false,
    expandInterventions: false,
    expandMedications: false,
    expandParticipants: false,
    actions: {
        toggleExpandProblems: function () {
            this.toggleProperty('expandProblems');
        },
        toggleExpandGoals: function () {
            this.toggleProperty('expandGoals');
        },
        toggleExpandInterventions: function () {
            this.toggleProperty('expandInterventions');
        },
        toggleExpandNutrition: function () {
            this.toggleProperty('expandNutrition');
        },
        toggleExpandMedications: function () {
            this.toggleProperty('expandMedications');
        },
        toggleExpandParticipants: function () {
            this.toggleProperty('expandParticipants');
        }
    }
});
