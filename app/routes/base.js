/*
 * Copyright 2016 The MITRE Corporation, All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
