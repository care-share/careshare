import Ember from 'ember';

export default Ember.Controller.extend({
    //These are stubs and serve as a placeholder until a query is put in place
    getAllMedications: ["Med Stub One", "Medication Stub Two", "Med Stub 3", "4"],
    getAllGoals: ["Goal Stub One", "Goal Stub Two", "Goal Stub Three"],
    goals: [],

    actions: {
        createRecord: function (type) {
            var id = this.controllerFor('patient').id;
			console.log('(CONTROLLER) CREATE RECORD - type: ' + type+',id: '+id);
            var reference = this.store.createRecord('reference', {
                reference: `Patient/${id}`
            });
            this.store.createRecord(type, {id: Math.round(new Date().getTime() / 1000)/*, patient: reference*/});

            //TODO: this is a crappy fix. Somebody please fix this fix :)
            this.controllerFor('careplan')
                .send('toggleShowProblems');
            this.controllerFor('careplan')
                .send('toggleShowProblems');
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
        deleteRecord: function (record) {
            console.log('(CONTROLLER) REMOVE RECORD- record: ' + record);
            record.destroyRecord();
        },
        saveRecord: function (record) {
            console.log('(CONTROLLER) SAVE RECORD- record: ' + record);
            record.save();
        },
        removeItem: function (record, index) {
            console.log('(CONTROLLER) REMOVE ARRAY ITEM - parent: ' + record + ',index: ' + index);
            if (record) {
                console.log('Array exists - removing item.');
                record.removeAt(index);
            }
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
        }
    }
});
