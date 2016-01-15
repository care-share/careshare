import model from 'ember-fhir-adapter/models/goal';
import DS from 'ember-data';
import nomChange from 'careshare/properties/nominations-change-property';

export default model.extend({
    carePlans: DS.hasMany('care-plan' ,{'async': true}),
    nominations: DS.attr('array'),
    changes: nomChange(),
    init: function(){
        console.log("I MADE A GOAL AND ITS CAREPLAN IS ");
        console.log(carePlans)
    }
});