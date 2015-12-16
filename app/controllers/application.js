import Ember from 'ember';
import API from '../api';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    apiUrl: window.Careshare.apiUrl,
    isOpenID: window.Careshare.isOpenID,
    isSideBarDisplayed: true,
    lastLoginFailed: false,
    isShowingForm: true,
    accountRequestSucceeded: false,
    accountRequestFailed: false,
    errorMessage: 'An unknown error occurred.',
    errorType: 'alert-danger',
    patientCounter: 0,
    signInType: 'signin',
    showOpenID: false,
    hidden: false,
    noDisplay: false,
    actions: {
        accountRequest: function () {
            API.submitRequest(this.getProperties('first', 'last', 'email', 'pass'), this);
        },
        toggleSideBarVisibility: function () {
            console.log("SideBar toggleNoDisplay");
            this.toggleProperty('isSideBarDisplayed');
        },
        openidlogin: function (data) {
            console.log('App controller: openidlogin(' + data + ')');
            var that = this;
            return this.get('session')
                .authenticate('authenticator:custom', data)
                .then(function () {
                    that.send('checkTemplate');
                });
        },
        validate: function () {
            console.log('App controller: validate');
            var credentials = this.getProperties('identification', 'password');
            console.log('ID: ' + credentials.identification + ',PASS: ' + credentials.password);
            var that = this;
            return this.get('session')
                .authenticate('authenticator:custom', credentials)
                .then(function () {
                    that.send('checkTemplate');
                });
        },
        invalidate: function () {
            console.log('App controller: invalidate ' + JSON.stringify(this.get('session')));
            var credentials = this.getProperties('identification', 'password');
            var that = this;
            return this.get('session')
                .invalidate(credentials)
                .then(function () {
                    that.send('checkTemplate');
                });
        },
        patientsCount: function () {
            console.log('getPatientCount called!');
            return 5;
        }.property('model', 'patientCounter'),
        toggleLoginForm: function () {
            this.set('lastLoginFailed', false);
            this.set('accountRequestSucceeded', false);
            this.set('accountRequestFailed', false);
            this.toggleProperty('isShowingForm');
        },
        toggleHidden: function () {
            this.toggleProperty('hidden');
        },
        toggleNoDisplay: function () {
            this.toggleProperty('noDisplay');
        }

    }
});
