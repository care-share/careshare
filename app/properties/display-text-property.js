import Ember from 'ember';
// used to add a 'displayText' attribute to a model

export default function (attr) {
    return Ember.computed(attr, function () {
        let text = this.get(attr);
        if (text) {
            return text;
        }
        return '[No description]';
    });
}
