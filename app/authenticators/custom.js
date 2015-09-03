import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import API from '../api';

export default Base.extend({
  restore(data) {
    console.log("restore(data): " + JSON.stringify(data));
    return Ember.RSVP.resolve(data);
  },
  openidlogin(data){
    console.log("openidconnect("+data+")");
  },
  authenticate(data) {
    if(data != null && data['code'] != null){
      console.log("authenticate(openidconnect)");
      return API.openidlogin(data['code']);
    }
    console.log("authenticate(data): " + JSON.stringify(data));
    //alert("AUTHENTICATE called!");
    return API.login(data.identification, data.password);
  },
  invalidate(data) {
    console.log("invalidate(data): " + JSON.stringify(data));
    //alert("INVALIDATE called!");
    return API.logout(data);
  }
});
