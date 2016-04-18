import Ember from 'ember';

// used to add filter attributes to a model

export default {
    err: function (name, sortKey) {
        if (!sortKey) {
            sortKey = 'id';
        }
        return Ember.computed(`${name}.@each.isDeleted`, `${name}.@each.isError`, function () {
            return this.get(name).filter(function (item) {
                return !item.get('isDeleted') && !item.get('isError');
            }).sortBy(sortKey);
        });
    },
    err1: function (name) {
        // same as above, but for a single model instead of an array
        return Ember.computed(`${name}.isError`, `${name}.isDeleted`, function() {
            let reason = this.get(name);
            if (reason && !reason.get('isError') && !reason.get('isDeleted')) {
                return reason;
            }
            return null;
        });
    }
};
