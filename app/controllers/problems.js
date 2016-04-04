import CarePlanResource from 'careshare/controllers/careplan/resource';

export default CarePlanResource.extend({
    // define the "CarePlan -> <model>" relationship for this controller's model
    carePlanRefAttr: 'addresses',
    lastExpanded: null,
    parentController: null,
    isChangeRequest: false,
    goalsModel: null,
    // the "carePlanRefAttr" field is set by child controllers
    setup: function () {
        console.log('PARENT CONTROLLER: ' + this.controllerFor('careplan'));
        this.set('goalsModel',this.controllerFor('careplan').get('goals'));
        this.set('parentController', this.controllerFor('careplan'));
    }.on('init'),
    changeRequestObserver: function () {
        this.set('isChangeRequest', this.get('parentController.isChangeRequest'));
        console.log('IS CHANGE REQUEST: ' + this.get('isChangeRequest'));
    }.observes('parentController.isChangeRequest'),
    actions: {
        createRecord: function (type) {
            var code = this.store.createRecord('codeable-concept');
            var severity = this.store.createRecord('codeable-concept');
            var category = this.store.createRecord('codeable-concept');
            var args = {
                code: code,
                severity: severity,
                category: category
            };
            this._super(type, args);
        },
        saveRecord: function (record) {
            console.log('(PROBLEMS CONTROLLER) SAVE RECORD- record: ' + record + '');


            //TODO: Need to reload the controller to call init() and reset the diff. Should we be calling record.reload()???
            return this._super(record);
        }
    }
});
