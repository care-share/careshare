import model from 'ember-fhir-adapter/models/goal';
import DS from 'ember-data';
import nomChange from 'careshare/properties/nominations-change-property';

export default model.extend({
    // nominations:[
    //      {
    //         "carePlanId": "1452522814664-10000002",
    //         "authorId": "admin@mitre.org",
    //         "resourceId": "1452522814664-40000015",
    //         "timestamp": 1452625347256,
    //         "action": "update",
    //         "existing": {
    //           "resourceType": "Goal",
    //           "id": "1452522814664-40000015",
    //           "meta": {
    //             "versionId": "1",
    //             "lastUpdated": "2016-01-11T14:34:26.562+00:00"
    //           },
    //           "subject": {
    //             "reference": "Patient/1452522814664-333-333-3333"
    //           },
    //           "description": "Patient will maintain bowel & bladder function without infection/constipation during this cert period",
    //           "status": "accepted",
    //           "priority": {
    //             "text": "high"
    //           }
    //         },
    //         "proposed": {
    //           "resourceType": "Goal",
    //           "id": "1452522814664-40000015",
    //           "meta": {
    //             "versionId": "1",
    //             "lastUpdated": "2016-01-11T14:34:26.562+00:00"
    //           },
    //           "subject": {
    //             "reference": "Patient/1452522814664-333-333-3333"
    //           },
    //           "description": "Win the PowerBall lottery",
    //           "status": "accepted",
    //           "priority": {
    //             "text": "high"
    //           }
    //         },
    //         "diff": [
    //           // {
    //           //   "op": "replace",
    //           //   "path": "/description",
    //           //   "originalValue": "Patient will maintain bowel & bladder function without infection/constipation during this cert period",
    //           //   "value": "Win the PowerBall lottery"
    //           // },
    //           // {
    //           //   "op": "replace",
    //           //   "path": "/description",
    //           //   "originalValue": "x",
    //           //   "value": "y"
    //           // },
    //           // {
    //           //   "op": "replace",
    //           //   "path": "/status",
    //           //   "originalValue": "old status",
    //           //   "value": "new status"
    //           // }
    //         ]
    //       }
    //     ],
    carePlans: DS.belongsTo('care-plan', {'async': true}),
    nominations: DS.attr('array'),
    changes: nomChange(),
    init: function(){
    }
});
