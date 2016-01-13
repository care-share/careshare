import model from 'ember-fhir-adapter/models/goal';
import diffProp from 'careshare/properties/diff-property';

export default model.extend({
    nominations:[
         {
            "carePlanId": "1452522814664-10000002",
            "authorId": "admin@mitre.org",
            "resourceId": "1452522814664-40000015",
            "timestamp": 1452625347256,
            "action": "update",
            "existing": {
              "resourceType": "Goal",
              "id": "1452522814664-40000015",
              "meta": {
                "versionId": "1",
                "lastUpdated": "2016-01-11T14:34:26.562+00:00"
              },
              "subject": {
                "reference": "Patient/1452522814664-333-333-3333"
              },
              "description": "Patient will maintain bowel & bladder function without infection/constipation during this cert period",
              "status": "accepted",
              "priority": {
                "text": "high"
              }
            },
            "proposed": {
              "resourceType": "Goal",
              "id": "1452522814664-40000015",
              "meta": {
                "versionId": "1",
                "lastUpdated": "2016-01-11T14:34:26.562+00:00"
              },
              "subject": {
                "reference": "Patient/1452522814664-333-333-3333"
              },
              "description": "Win the PowerBall lottery",
              "status": "accepted",
              "priority": {
                "text": "high"
              }
            },
            "diff": [
              {
                "op": "replace",
                "path": "/description",
                "originalValue": "Patient will maintain bowel & bladder function without infection/constipation during this cert period",
                "value": "Win the PowerBall lottery"
              }
            ]
          }
        ],
    changes: {},
    init: function(){
        //this.set('example', {'description': [1,2,3,4,5]})
        console.log("Init for Goal")

        var noms = this.get('nominations')
        console.log(noms)
        for (var n in noms){
            if (noms.hasOwnProperty(n)){
                for (var d in noms[n].diff){
                    if (noms[n].diff.hasOwnProperty(d)){
                        var diffObj = noms[n].diff[d]
                        console.log(diffObj)
                        var crObj = {
                            'originalValue': diffObj.originalValue,
                            'value': diffObj.value
                        }
                        var pathNameWithDash = diffObj.path.replace('/','-')
                        if (this.get('changes')[pathNameWithDash]){
                            this.get('changes')[pathNameWithDash].push(crObj);
                        }
                        else {
                            this.get('changes')[pathNameWithDash] = [crObj];
                        }
                    }
                }
            }

        }
    }
});