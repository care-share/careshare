import DS from 'ember-data';

export default DS.Model.extend({
    // TODO: these will eventually be string attributes
    name: DS.attr('boolean'),
    dose: DS.attr('boolean'),
    freq: DS.attr('boolean'),
    note: DS.attr('boolean')
});
