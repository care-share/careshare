//Adapted from http://stackoverflow.com/questions/14450862/ember-js-input-fields
import Ember from 'ember';

export default Ember.TextField.extend({
  type: 'number',
  attributeBindings: ['min', 'max', 'step'],
  numbericValue : function (key,v) {
    if (arguments.length === 1)
      return parseFloat(this.get('value'));
    else
      this.set('value', v !== undefined ? v+'' : '');
  }.property('value'),
  didInsertElement: function() {
    this.$().keypress(function(key) {
      if((key.charCode!=46)&&(key.charCode!=45)&&(key.charCode < 48 || key.charCode > 57)) return false;
    })  
  }
})