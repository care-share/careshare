import base from 'careshare/routes/base';

export default base.extend({
    beforeModel() {
        this.transitionTo('patients');
    }
});