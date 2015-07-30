import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import API from '../api';

export default Base.extend({
  restore(data) {
    console.log("restore(data): " + JSON.stringify(data));
    //alert("RESTORE called!");
    return Ember.RSVP.resolve();
  },

  authenticate(credentials) {
  //DS.store.createRecord('post',{id: "tempID",pass: "tempPass"});
    console.log("authenticate(credentials): " + JSON.stringify(credentials));
  //var credentials = this.getProperties('identification', 'password');
   // alert("AUTHENTICATE called!");
    return API.login(credentials.identification, credentials.password);
  },

  invalidate(data) {
    console.log("invalidate(data): " + JSON.stringify(data));
    //alert("INVALIDATE called!");
    return API.logout();
  }
});
