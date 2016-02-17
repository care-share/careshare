import Ember from 'ember';

export default Ember.ObjectController.extend({
    actions: {
        enforceVA: function (medpair) {
            console.log("Enforcing VA")
            // medpair.homeMed.action = 'Enforce VA';
            medpair.set('homeMed.action', 'Enforce VA')
        },
        acceptHH: function (medpair) {
            console.log("Accepting HH")
            // medpair.homeMed.action = 'Accept HH';
            medpair.set('homeMed.action', 'Accept HH')
        }
    }


});
