import base from 'careshare/routes/base';

export default base.extend({
    model: function () {
        return this.store.query('Goal', {})
            .then(
                function (response) {
                    console.log('PROMISE OK!: ' + response);
                    return response;
                }, function (error) {
                    console.log('PROMISE ERROR! ' + error);
                }
            );
    }
});
