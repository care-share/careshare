import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    _id: DS.attr('string'),
    medication_order_id: DS.attr('string'),
    name: DS.attr('string'),
    dose: DS.attr('string'),
    freq: DS.attr('string'),
    note: DS.attr('string'),
    not_found: DS.attr('boolean'),
    compliance_bool: DS.attr('boolean'),
    noncompliance_note: DS.attr('string'), // goes with compliance_bool:false
    med_bool: DS.attr('boolean'), // ridiculously named variable -- true means this came from the primary care org, false means it's an outside prescriber
    prescribed_by_primary: Ember.computed.alias('med_bool'), // so let's use another name for it 
    prescriber_note: DS.attr('string'), // goes with med_bool/prescribed_by_primary:false
    // added by user in Ember template
    action: DS.attr('string'),
    hhNotes: DS.attr('string'),
    vaNotes: DS.attr('string'),
    actionNeedsSignature: Ember.computed('action', function () {
        switch (this.get('action')) {
            case 'Accept HH':
            case 'Renew':
            case 'Enforce VA':
            case 'Do not use':
            case 'Clarify':
                return true;
            default:
            case 'No action':
                return false;
        }
    })
});
