import Ember from 'ember';

export default Ember.TextArea.extend({
didRender() {
    this.$().keypress(function(event) {
      if (event.keyCode == 13) {
        event.preventDefault();
      }
    });
  }
});