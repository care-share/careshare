import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    renderTemplate: function () {
        console.debug(`CARESHARE: Route "${this.routeName}", renderTemplate()`);
        this.showOrHideSideBar();
        this._super();
    },
    showOrHideSideBar: function () {
        // does this route show or hide the side bar?
        // by default, all routes show the side bar
        // if the route has the 'hideSideBar' attribute set to true, then the route will instead hide the side bar
        var hideSideBar = this.get('hideSideBar');
        this.controllerFor('application').set('isSideBarDisplayed', !hideSideBar);
    }
});
