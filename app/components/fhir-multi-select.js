import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    classNames: ['fhir-multi-select'],
    optionsList: [],
    setup: function () {
        this.set('optionsList', this.get('options'));
    }.on('init')
});