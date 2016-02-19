import base from 'careshare/routes/base';

export default base.extend({
    model: function () {
        return this.store.query('patient', {})
            .then(function (response) {
                    console.log('PROMISE OK!: ' + response);
                    return response;
                },
                function () {
                    console.log('PROMISE ERROR!');
                });
    }
});
