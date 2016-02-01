import Ember from 'ember';

export default Ember.Component.extend({
    patcher: new diff_match_patch(),
    nameID: '',
    passthroughInit: function () {
        console.log('Passthrough INIT: parent= '+this.get('parent'));
        this.set('nameID',this.get('name')+new Date().valueOf()+Math.random());
        //Get a string representation of the ORIGINAL property
        var sanitizedValue = this.get('parent').get(this.get('name')) ? this.get('parent').get(this.get('name')) : '';
        this.set('originalValue', sanitizedValue);

        // Does not work even though it returns the computed property and not the evaluation
        // this.set('passthrough', this.get('parent')[this.get('name')])

        //Creates a computed property that acts as a pass though from inner component to actual parent model
        Ember.defineProperty(this, 'passthrough', Ember.computed(function(key, value) {
                // Set parent variable when passthrough is edited externally
                if (arguments.length > 1) {
                  console.log('(passthrough-component) parent: '+this.get('parent')+',name: '+this.get('name')+',parent.name: '+this.get('parent').get('repeat'));
                  this.get('parent').set(this.get('name'), value);
                }
                // Sets passthrough to this when property changes
                return this.get('parent.' + this.get('name'));
            }).property('parent.' + this.get('name')));


    }.on('init')
});
