import Ember from 'ember';

export default Ember.Controller.extend({
    role: 'user',
    isAdmin: function() {
        return this.get('session').content.secure.user.role === 'admin';
    }.property('role')
});
