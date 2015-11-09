import Ember from 'ember';
import API from '../api';

export default Ember.Controller.extend({
    mUser: undefined,
    mFhirId: undefined,
    mSearch: "",
    mPractitioners: [],
    mClose: false,
    mSubmitting: false,
    actions: {
        modalToggle: function (toggler) {
            var user = toggler.get('user');
            this.set('mUser', user);
            this.set('mFhirId', user.fhir_id);
            this.set('mSearch', user.name_last);
            this.set('mPractitioners', []);
            //this.set('mSearch', 'fred'); // TODO: remove this stub code
            this.findPractitioners();
        },
        modalSearch: function () {
            this.findPractitioners();
        },
        modalSetFhirId: function (fhir_id) {
            this.set('mFhirId', fhir_id);
        },
        modalSubmit: function () {
            // change user's FHIR ID in local storage
            var fhir_id = this.get('mFhirId');
            this.set('mUser.fhir_id', fhir_id);
            // change user's FHIR ID in the database
            API.changeFhirId(this.get('mUser.email'), fhir_id, this.get('session').get('secure'), this);
            // clear props
            this.set('mUser', undefined);
            this.set('mFhirId', undefined);
            this.set('mSearch', '');
            this.set('mPractitioners', []);
            this.set('mClose', true);
        },
        reset: function () {
            this.get('target').send('reset', this);
        },
        approve: function (email) {
            console.log("approve(controller) called");
            this.get('target').send('approve', email, this.get('session').get('secure'), this);
        },
        deny: function (email) {
            console.log("deny(controller) called");
            this.get('target').send('deny', email, this.get('session').get('secure'), this);
        },
        toggleRole: function (email, role, isHeld) {
            console.log("toggleRole(controller) called");
            if (!isHeld) {
                this.get('target').send('addRole', email, role, this.get('session').get('secure'), this);
            } else {
                this.get('target').send('removeRole', email, role, this.get('session').get('secure'), this);
            }
        }
    },
    findPractitioners: function () {
        var search = this.get('mSearch');
        this.set('mIsSearching', true);
        var that = this;
        this.store.query('practitioner', {name: search, _count: 10})
            .then(function (response) {
                that.set('mPractitioners', response);
            }, function (error) {
                console.log("Error retrieving practitioners: " + error);
            }).finally(function() {
                that.set('mIsSearching', false);
            });
    }
});
