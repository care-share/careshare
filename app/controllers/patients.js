import Ember from 'ember';

export default Ember.ArrayController.extend({
    needs: 'application',
    application: Ember.computed.alias('controllers.application'),
    appController: Ember.inject.controller('application'),
    currentId: null,
    careplans: null,
    actions: {
        doLazyLoad: function(patient) {
            // triggers queries for attributes that are lazy-loaded (e.g. Care Plans)
            patient.set('doLazyLoad', true);
        },
        renderPatient: function (/*id*/) {
            console.log('Rendering patient from patients');
            //this.transitionToRoute('patient.filters', id);
            return true;
        },
        renderCarePlan: function (patientID) {
            console.log('Rendering patient from patients');
            var e = document.getElementById('dropdown' + patientID);
            //this.transitionToRoute('patient.filters', id);
            var careplanID = e.options[e.selectedIndex].value;

            // this.get('controller').transitionToRoute('careplan', testing);
            this.transitionToRoute('careplan.filters', patientID, careplanID);
            //return true;
        },
        toggleExpanded: function () {
            this.set('currentId', null);
        },
        getCarePlans: function (id) {
            var parent = this;
            this.store.find('CarePlan', {
                    subject: id
                })
                .then(function (response) {
                    if (response != null) {
                        parent.set('currentId', id);
                        if (response.toArray().length > 0) {
                            parent.set('careplans', response);
                        } else {
                            parent.set('careplans', [{
                                description: '(NONE)',
                                id: -9999
                            }]);
                        }
                    }
                });
        },
        createPatient: function () {
            var givenName = this.get('givenName');
            var familyName = this.get('familyName');
            if (!givenName.trim() || !familyName.trim()) {
                return;
            }

            var name = this.store.createRecord('human-name', {
                given: givenName,
                family: familyName
            });
            var patient = this.store.createRecord('patient', {
                name: [name],
                birthDate: new Date(),
                active: true
            });

            // Save the new model
            patient.save();
        }
    },
    patientCounter: 0,
    patientCount: function () {
        var patients = this.get('content');
        var counter = 0;
        patients.filter(function () {
            counter++;
        });
        return counter;
    }.property('model', 'patientCounter'),
    filterText: '',
    filteredContent: function () {
        var filter = this.get('filterText');
        var rx = new RegExp(filter, 'gi');
        var returnedArr = this.get('content')
            .filter(function (patient) {
                if (patient.get('name') !== null) {
                    var thisPatient = patient.get('name')
                        .objectAt(0);
                    var fullName = thisPatient.get('given') + ',' + thisPatient.get('family');
                    return fullName.match(rx);
                }
            });

        return returnedArr.sort(function (a, b) {
            return a.get('name')
                    .objectAt(0)
                    .get('family') - b.get('name')
                    .objectAt(0)
                    .get('family');
        });
    }.property('model', 'filterText')
});
