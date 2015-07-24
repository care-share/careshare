import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

export default Base.extend({
  restore(data) {
    alert("RESTORE called!");
    return Ember.RSVP.reject();
  },

  authenticate(credentials) {
    alert("AUTHENTICATE called! "+credentials.identification+","+credentials.password);
    return Ember.RSVP.resolve();
  },

  invalidate(data) {
    alert("INVALIDATE called!");
    return Ember.RSVP.resolve();
  }
});
