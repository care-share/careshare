import Ember from 'ember';

export default Ember.Controller.extend({
    isBannerDisplayed: true,
    actions: {
        toggleViewVisibility: function () {
            //alert('toggleViewVisibility called!');
            this.set('isBannerDisplayed', false);
            // this.set('isBannerDisplayed', !this.get('isBannerDisplayed'));
        }
    }
});
