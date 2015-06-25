import Ember from 'ember';

export default Ember.ObjectController.extend({
    isBannerDisplayed: true,
    actions:{
      toggleViewVisibitity:function(){
          //alert('toggleViewVisibility called!');
          this.set('isBannerDisplayed',false);
         // this.set('isBannerDisplayed', !this.get('isBannerDisplayed'));
      }
    }
});
