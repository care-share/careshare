import DS from 'ember-data';

export default DS.Model.extend({
    _id: DS.attr('string'),
    medication_order_id: DS.attr('string'),
    name: DS.attr('string'),
    dose: DS.attr('string'),
    freq: DS.attr('string'),
    note: DS.attr('string'),
    // added by user in Ember template
    action: DS.attr('string'),
    hhNotes: DS.attr('string'),
    vaNotes: DS.attr('string'),
    actionNeedsSignature: Ember.computed('action', function() {
        switch(this.get("action")){
        case "Accept HH":
        case "Enforce VA":
        case "Clarify":
            return true;
            break;
        case "No Action":
        default:
            return false;
        }
    })
});
