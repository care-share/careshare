import CarePlanResource from 'careshare/controllers/careplan/resource';

export default CarePlanResource.extend({
    // define the "CarePlan -> <model>" relationship for this controller's model
    carePlanRefAttr: 'addresses',
	lastExpanded: null,
    // the "carePlanRefAttr" field is set by child controllers
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
        }
    }
});
