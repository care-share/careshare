import CarePlanResource from 'careshare/controllers/careplan/resource';

export default CarePlanResource.extend({
    // define the "CarePlan -> <model>" relationship for this controller's model
    carePlanRefAttr: 'goal',
    actions: {
        saveRecord: function (record) {
            console.log('(GOALS CONTROLLER) SAVE RECORD- record: ' + record + '');
            return this._super(record);
        }
    }
});
