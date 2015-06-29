import DS from 'ember-data';

export default DS.Model.extend({
//  identifier: // FHIR: Identifier 0..*
  subject: DS.hasOne('patient'),
//  encounter: // FHIR: Resource(Encounter) 0..1
//  asserter: // FHIR: Resource(Practitioner) 0..1
  dateAsserted: DS.attr("date"),
//  code: // FHIR: CodeableConcept 1..1 <<ConditionKind>>
//  category: // FHIR: CodeableConcept 0..1 <<ConditionCategory>>
//  status: // FHIR: code 1..1 <<ConditionStatus>>
//  certainty: // FHIR: CodeableConcept 0..1 <<ConditionCertainty>>
//  severity: // FHIR: CodeableConcept 0..1 <<ConditionSeverity>>
//  FHIR: onset[x] : date|Age 0..1
//  FHIR: abatement[x] : date|Age|boolean 0..1
  notes: DS.attr('string')

});
