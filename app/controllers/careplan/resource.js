import Ember from 'ember';
import uuid from 'ember-uuid/utils/uuid-generator';

export default Ember.Controller.extend({
    // the "carePlanRefAttr" field is set by child controllers
    actions: {
        createRecord: function (type, args) {
            // create a time-based ID so records can be sorted in chronological order by ID
            var dateTime = new Date().getTime();
            var newId = `${dateTime}-${uuid.v4()}`;
            console.log(`(CONTROLLER) CREATE RECORD - type: ${type}, id: ${newId}`);

            // add "<model> -> Patient" reference
            var patientId = this.controllerFor('patient').id;
            var patientRef = this.store.createRecord('reference', {
                reference: `Patient/${patientId}`
            });
            if (!args) {
                args = {};
            }
            args.id = newId;
            args.patient = patientRef;
            args.isNewRecord = true;
            this.store.createRecord(type, args);
            // FIXME: this shouldn't be necessary, see controllers/careplan.js
            this.controllerFor('careplan').doPeek(type);

            // animate column
            var problemsColumn = Ember.$('#problems-column');
            problemsColumn.animate({scrollTop: problemsColumn.height() + 1000}, 'slow');
        },
        deleteRecord: function (record) {
            console.log('(CONTROLLER) REMOVE RECORD- record: ' + record);

            // remove "CarePlan -> <model>" reference
            var carePlan = this.controllerFor('careplan').get('CarePlan');
            var refs = carePlan.get(this.carePlanRefAttr)
                .toArray();
            var modelName = record._internalModel.modelName.camelize().capitalize();
            var that = this;
            for (var i = 0; i < refs.length; i++) {
                var ref = refs[i].get('reference');
                if (that.carePlanRefAttr === 'activity') {
                    // the CarePlan activity field requires a 'backbone' wrapper element...
                    ref = ref.get('reference');
                }
                if (ref === `${modelName}/${record.id}`) {
                    // remove the reference at this index in the array
                    refs.splice(i, 1);
                }
            }
            carePlan.set(this.carePlanRefAttr, refs);
            carePlan.save().then(function () {
                // remove this model
                record.destroyRecord().then(function () {
                    // FIXME: this shouldn't be necessary, see controllers/careplan.js
                    that.controllerFor('careplan').doPeek(modelName);
                });
            });
        },
        saveRecord: function (record) {
            console.log('(CONTROLLER) SAVE RECORD- record: ' + record);
            var modelName = record._internalModel.modelName.camelize().capitalize();
            var carePlan = this.controllerFor('careplan').get('CarePlan');
            var that = this;

            // check if this is a new record or if we are updating an existing one
            var isNewRecord = record.get('isNewRecord');
            if (isNewRecord) {
                record.set('isNewRecord',undefined);
            }

            // save this model
            record.save().then(function () {
                // iff this is a new record, add "CarePlan -> <model>" reference
                if (!isNewRecord) {
                    return;
                }

                var ref = that.store.createRecord('reference', {
                    reference: `${modelName}/${record.id}`
                });
                if (that.carePlanRefAttr === 'activity') {
                    // the CarePlan activity field requires a 'backbone' wrapper element...
                    ref = that.store.createRecord('care-plan-activity-component', {
                        reference: ref
                    });
                }
                var refs = carePlan.get(that.carePlanRefAttr)
                    .toArray();
                refs.addObject(ref);
                carePlan.set(that.carePlanRefAttr, refs);
                carePlan.save();
            });
        },
        updateRecord: function (record, name, type) {
            console.log('(CONTROLLER) UPDATE RECORD - parent: ' + record + ',name: ' + name + ',type: ' + type);
			if (record && !record.get(name)) {
                var newRecord = this.store.createRecord(type, {});
                console.log('MODEL NAME: ' + record.toString());
                console.log('++NEW RECORD: ' + newRecord + '++');
                record.set(name, newRecord);
            } else {
                console.log('!!FAILED - parent does not exist or record already exists!!');
            }
        },
		undoRecord: function(record){
		    console.log('(' + this.get('me') + ') UNDO RECORD - record: ' + record);
			record.rollbackAttributes();
			record.reload();
		},
        updateArray: function (record, name, type) {
            console.log('(CONTROLLER) UPDATE ARRAY - parent: ' + record + ',name: ' + name + ',type: ' + type);
            var newRecord = this.store.createRecord(type, {});
            if (record) {
                console.log('Array exists - adding to array.');
                record.pushObject(newRecord);
            } else {
                console.log('Array does not exist - creating new array.');
                record = [newRecord];
            }
        },
        removeItem: function (record, index) {
            console.log('(CONTROLLER) REMOVE ARRAY ITEM - parent: ' + record + ',index: ' + index);
            if (record) {
                console.log('Array exists - removing item.');
                record.removeAt(index);
            }
        }
    }
});
