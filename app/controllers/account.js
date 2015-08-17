import Ember from 'ember';

export default Ember.Controller.extend({
    role: 'user',
    isAdmin: function() {
        return /*this.get('session').secure.role === 'admin'*/true;
    }.property('role')
});
