import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore(data) {
    alert("RESTORE called!");
    return Ember.RSVP.reject();
  },

  authenticate(credentials) {
  //DS.store.createRecord('post',{id: "tempID",pass: "tempPass"});
  console.log("authenticator ID: "+credentials.identification+",authenticator PASS: "+credentials.password);
  //var credentials = this.getProperties('identification', 'password');
    alert("AUTHENTICATE called!");
    return Ember.RSVP.resolve();
  },

  invalidate(data) {
    alert("INVALIDATE called!");
    return Ember.RSVP.resolve();
  }
});
