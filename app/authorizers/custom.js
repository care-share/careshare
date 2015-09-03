import Ember from 'ember';
import Base from 'simple-auth/authorizers/base';

export default Base.extend({
    /**
     Authorizes an XHR request by sending the `token` property from the
     session as a bearer token in the `X-Auth-Token` header:
     ```
     X-Auth-Token: <token>
     ```
     @method authorize
     @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
     @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
     */
    authorize(jqXHR){
        var accessToken = this.get('session.secure.token');
        if (this.get('session.isAuthenticated') && !Ember.isEmpty(accessToken)) {
            jqXHR.setRequestHeader('X-Auth-Token', accessToken);
        }
    }
});
