import Ember from 'ember';

// used to add filter attributes to a model

export default {
    // we can't use the existing 'hasDirtyAttributes' computed property for records, because:
    // 1. it gets flagged when non-canonical properties are canged (such as 'isExpanded'), and
    // 2. it does NOT get flagged when child records get dirtied
    watch: function (attrs, children) {
        // 'attrs' is an array of primitive attributes to watch
        // 'children' is an array of child models to watch (either 'belongsTo' or 'hasMany' relationships)
        let watch = attrs.slice(); // which attributes to watch
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            watch.push(`${child}.hasDirtyAttributes`);
        }
        watch.push('currentState.isNew');
        watch.push('acceptedNominations.[]');
        watch.push('rejectedNominations.[]');
        // the array of attributes to watch needs to be 'spread'ed so the array elements are treated as individual arguments
        return Ember.computed(...watch, function () {
            // if we don't have one already, store a snapshot of the attributes we're monitoring
            let snapshot = this.get('cleanSnapshot');
            if (snapshot === undefined) {
                snapshot = {};
                for (let i = 0; i < attrs.length; i++) {
                    let attr = attrs[i];
                    snapshot[attr] = this.get(attr);
                }
                this.set('cleanSnapshot', snapshot);
                return false;
            }
            let isNew = this.get('currentState.isNew');
            let anyAccepted = this.get('acceptedNominations.length') > 0;
            let anyRejected = this.get('rejectedNominations.length') > 0;
            if (isNew || anyAccepted || anyRejected) {
                return true;
            }

            // check if any attributes of this model are dirty
            let result = false;
            for (let i = 0; i < attrs.length; i++) {
                let attr = attrs[i];
                let value = this.get(attr);
                if (snapshot[attr] === undefined) {
                    // when we set a value and then roll it back, it may go from undefined to null
                    // these are the same as far as FHIR is concerned, make sure we account for that
                    if (value !== undefined && value !== null) {
                        result = true;
                        break;
                    }
                } else if (value !== snapshot[attr]) {
                    result = true;
                    break;
                }
            }
            if (result) {
                return result;
            }
            // check if any attributes of child models are dirty
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                if (child.endsWith('@each')) {
                    let attr = child.slice(0, -6);
                    if (this.get(attr).isAny('hasDirtyAttributes')) {
                        result = true;
                        break;
                    }
                } else if (child.endsWith('[]')) {
                    let attr = child.slice(0, -3);
                    let current = this.get(`${attr}.content.currentState`);
                    let canonical = this.get(`${attr}.content.canonicalState`);
                    if (Ember.compare(current, canonical) !== 0) {
                        result = true;
                        break;
                    }
                } else {
                    if (this.get(`${child}.hasDirtyAttributes`)) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        });
    }
};
