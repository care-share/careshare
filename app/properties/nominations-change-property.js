// used to add a 'diff' attribute to a model

export default function () {
    return function() {
        // Sets changes to this when nominations changes
        var changeDic = {};
        var noms = this.get('nominations');
        for (var n in noms){
            if (noms.hasOwnProperty(n)){
                if (n.startsWith('__')) {
                    // weird JavaScript object property, not what we want, continue
                    continue;
                }
                // nomination.diff used to be an array of objects, now it is a single object
                var diffObj = noms[n].diff;
                if (diffObj === null || diffObj === undefined || JSON.stringify(diffObj) === "{}") {
                    // we have no diffObj (this is either a 'create' or 'delete' nomination)
                    break;
                }
                var crObj = {
                    id: noms[n].id,
                    originalValue: diffObj.originalValue,
                    value: diffObj.value
                };
                if (crObj.originalValue === null || crObj.originalValue === undefined) {
                    crObj.originalValue = "";
                }
                // if this attribute is for a related record, such as CodeableConcept, it will show up as 'add' instead of 'replace'
                let path = diffObj.path;
                if (diffObj.op === 'add' && typeof(diffObj.value) === 'object') {
                    for (let key in diffObj.value) {
                        if (diffObj.value.hasOwnProperty(key)) {
                            path += `/${key}`;
                            crObj.value = crObj.value[key];
                            break;
                        }
                    }
                }
                var pathNameWithDash = path.split('/').join('-'); // replace all / in path with -
                if (changeDic[pathNameWithDash]){
                    changeDic[pathNameWithDash].push(crObj);
                }
                else {
                    changeDic[pathNameWithDash] = [crObj];
                }
            }
        }

        return changeDic;
    }.property('nominations');
}