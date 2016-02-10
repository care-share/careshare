import Ember from 'ember';

export default Ember.TextField.extend({
    type: 'number',
    attributeBindings: ['min', 'max'],
    numbericValue: function (key, v) {
        if (arguments.length === 1) {
            return parseInt(this.get('value'));
        }
        else {
            this.set('value', v !== undefined ? v + '' : '');
        }
    }.property('value'),
    didInsertElement: function () {
        this.$().keypress(function (key) {
            if (key.charCode < 48 || key.charCode > 57) {
                return false;
            }
        });
    }
});