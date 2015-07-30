import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import API from '../api';

export default Base.extend({
  restore(data) {
    console.log("restore(data): " + JSON.stringify(data));
    //alert("RESTORE called!");
    return Ember.RSVP.resolve(data);
  },

  authenticate(data) {
    console.log("authenticate(credentials): " + JSON.stringify(data));
   // alert("AUTHENTICATE called!");
    return API.login(data.identification, data.password);
  },

  invalidate(data) {
    console.log("invalidate(data): " + JSON.stringify(data));
    //alert("INVALIDATE called!");
    return API.logout();
  }
});
