import CarePlanResource from 'careshare/controllers/careplan/resource';

export default CarePlanResource.extend({
    // define the "CarePlan -> <model>" relationship for this controller's model
    carePlanRefAttr: 'activity',
    lastExpanded: null,
	parentController: null,
	isChangeRequest: false,
    // the "carePlanRefAttr" field is set by child controllers
	setup: function(){
		console.log('PARENT CONTROLLER: '+this.controllerFor('careplan'));
	    this.set('parentController',this.controllerFor('careplan'));
	}.on('init'),
	changeRequestObserver: function(){
		this.set('isChangeRequest',this.get('parentController.isChangeRequest'));
		console.log('IS CHANGE REQUEST: '+this.get('isChangeRequest'));
	}.observes('parentController.isChangeRequest'),
    actions: {
        saveRecord: function (record) {
            console.log('(NUTRITION CONTROLLER) SAVE RECORD- record: ' + record + '. Applying diffs...');

            //Manually set diffs (TODO: for now, but maybe do this automatically in the future?).
            record.set('supplement.firstObject.productName',record.get('supplement.firstObject.productNameDiff'));
            record.set('status',record.get('statusDiff'));
            record.set('supplement.firstObject.type.text',record.get('supplement.firstObject.type.textDiff'));
            record.set('supplement.firstObject.instruction',record.get('supplement.firstObject.instructionDiff'));
            record.set('dateTime',record.get('dateTimeDiff'));

            //TODO: Need to reload the controller to call init() and reset the diff. Should we be calling record.reload()???
            return this._super(record);
        }
    }
});
