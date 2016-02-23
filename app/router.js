import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

export default Router.map(function () {
    // NOTE: if 'resetNamespace' is specified, the child route is not logically nested within the parent route
    // i.e. the file structure does not need to match the nested routes of the URL
    this.route('login');
    this.route('work-in-progress');
    this.route('account');
    this.route('patients');
    this.route('patient', {path: '/patients/:patient_id'}, function () {
        // parent route has an empty outlet
        // this gives children access to the patient router and controller, without rendering unwanted data on the page
        this.route('medrec', {resetNamespace: true});
        this.route('medentry', {resetNamespace: true});
        this.route('medaction', {resetNamespace: true});
        this.route('careplan-init', {path: '/careplans/init', resetNamespace: true});
        this.route('careplan', {path: '/careplans/:careplan_id', resetNamespace: true}, function () {
            this.route('filters');
            this.route('patientInfo');
            this.route('notes');
            this.route('history');
            this.route('requests');
        });
    });
});
