import DS from 'ember-data';

export default DS.Model.extend({
    // deserialized from CareAuth API response
    homeMed: DS.belongsTo('medentry', {embedded: true}),
    ehrMed: DS.belongsTo('medication-order', {embedded: true}),
    status: DS.attr('string'),
    discrepancy: DS.belongsTo('medpair-discrepancy', {embedded: true}),
    // added by user in Ember template
    action: DS.attr('string'),
    hhNotes: DS.attr('string'),
    vaNotes: DS.attr('string')
});
