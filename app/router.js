import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

export default Router.map(function () {
    this.route('login');
    this.route('goals');
    this.resource('account', {path: '/account'});
    this.resource('workInProgress');
    this.resource('medrec',  {path: '/patients/:patient_id/medrec'});
    this.resource('patients', function () {
        this.resource('patient', {path: '/:patient_id'}, function () {
            this.route('init');
            this.route('medentry');
            this.resource('careplans', function () {
                this.route('new');
                this.resource('careplan', {path: '/:careplan_id'}, function () {
//                    this.route('init');
                    this.route('filters');
                    this.route('patientInfo');
                    this.route('notes');
                    this.route('history');
                    this.route('requests');
                });
            });
        });
    });
});
