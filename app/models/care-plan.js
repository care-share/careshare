import DS from 'ember-data';

export default DS.Model.extend({
//  identifier: // FHIR: Identifier 0..*
  patient: DS.hasOne('patient'),
//  status: // FHIR: code 1..1 <<CarePlanStatus>>
//  period: // FHIR: Period 0..1
  modified: DS.attr("date"),
//  concern: DS.hasMany('condition') // condition model not yet implemented
  notes: DS.attr('string')

});
