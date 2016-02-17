import Ember from 'ember';

export default Ember.ObjectController.extend({
    actions: {
        enforceVA: function (medpair) {
            medpair.homeMed.action = 'Enforce VA';
        },
        acceptHH: function (medpair) {
            medpair.homeMed.action = 'Accept HH';
        }
    }


});
