import Ember from 'ember';

export default Ember.Controller.extend({
    role: 'user',
    isAdmin: function() {
        return this.get('session').get('secure').role === 'admin';
    }.property('role')
});
