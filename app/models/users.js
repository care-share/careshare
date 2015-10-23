import DS from 'ember-data';

export default DS.Model.extend({
    email: DS.attr('string'),
    name_first: DS.attr('string'),
    name_last: DS.attr('string'),
    roles: DS.attr('array'),
    allRoles: DS.attr('array'),
    approved: DS.attr('boolean'),
    date_created: DS.attr('date'),
    token: DS.attr(),
    //For reset we use a reset token with an expiry (which must be checked)
    reset_token: DS.attr('string'),
    reset_token_expires_millis: DS.attr('number')
});
