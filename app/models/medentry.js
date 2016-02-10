import DS from 'ember-data';

export default DS.Model.extend({
    _id: DS.attr('string'),
    medication_order_id: DS.attr('string'),
    name: DS.attr('string'),
    dose: DS.attr('string'),
    freq: DS.attr('string'),
    note: DS.attr('string')
});
