import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    setupController: function (controller) {
        console.log('is_openid: ' + window.Careshare.is_openid);
        if (window.Careshare.is_openid) {
            controller.set('signInType', 'signin-openid');
            controller.set('showOpenID', true);
        }
        else {
            controller.set('signInType', 'signin');
            controller.set('showOpenID', false);
        }
    },
    actions: {
        queryParamsDidChange: function (params) {
            if (params != null) {
                console.log('params changed...');
                if (params['code'] != null) {
                    console.log('ACCESS CODE = ' + params['code']);
                    this.controllerFor('application')
                        .send('openidlogin', params);
                }
                else if (params['error'] != null) {
                    console.log('OPENID ERROR = ' + params['error']);
                    this.controllerFor('application')
                        .set('errorMessage', 'Cannot proceed without required permissions.');
                    this.controllerFor('application')
                        .set('errorType', 'alert-warning');
                    this.controllerFor('application')
                        .set('lastLoginFailed', true);
                }
            }
        }
    }
});
