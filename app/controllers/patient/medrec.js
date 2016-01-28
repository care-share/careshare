import Ember from 'ember';
import API from '../../api';

export default Ember.ObjectController.extend({
    // controller dependencies
    session: Ember.inject.service('session'), // needed for ember-simple-auth
    apiUrl: window.Careshare.apiUrl
  });
