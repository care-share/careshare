import Ember from 'ember';
export default Ember.Component.extend({
    tagName: 'span',
    classNames: ['change-request'],
    patcher: new diff_match_patch(),
    change: function () {
        var diff = this.get('patcher').diff_main(this.get('old'),this.get('new'),true);
        return this.get('patcher').diff_prettyHtml(diff);
    }.property('old', 'new'),
    setup: function () {

    }.on('init'),

    actions: {
        accept: function(){
            this.get('parent').set(this.get('name'), this.get("new"));
        }
    }

});