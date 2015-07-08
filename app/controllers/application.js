import Ember from 'ember';

export default Ember.ObjectController.extend({
    isSideBarDisplayed: true,
    actions:{
      toggleSideBarVisibility:function(){
        this.set('isSideBarDisplayed',false);
      }
    }
});
