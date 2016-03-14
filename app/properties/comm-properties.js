import Ember from 'ember';

// used to add communication attributes to a model

export default {
    comms: Ember.computed(function() {
        var key;
        if (this._internalModel.modelName === 'care-plan') {
            key = 'careplan_id';
        } else if (this._internalModel.modelName === 'patient') {
            key = 'patient_id';
        } else {
            key = 'resource_id';
        }
        var value = this.get('id');
        return this.store.peekAll('comm').filterBy(key, value, {live: true});
        // note: in the above filter, the 'live: true' portion is used for the ember-data-live-filter-by addon
        // it instructs the addon to give us a live-updating array, so whenever another record is added to the store,
        // the array is recalculated!
    }),
    unreadCount: Ember.computed('comms.@each.hasSeen', function () {
        return this.get('comms').reduce(function(previousValue, communication){
            return previousValue + communication.get('hasSeen') ? 0 : 1;
        }, 0);
    })
};
