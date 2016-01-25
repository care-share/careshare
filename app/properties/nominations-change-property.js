// used to add a 'diff' attribute to a model

export default function () {
    return function() {
        // Sets changes to this when nominations changes
        var changeDic = {};
        var noms = this.get('nominations');
        for (var n in noms){
            if (noms.hasOwnProperty(n)){
                // nomination.diff used to be an array of objects, now it is a single object
                var diffObj = noms[n].diff;
                if (diffObj === null || diffObj === undefined || JSON.stringify(diffObj) === "{}") {
                    // we have no diffObj (this is either a 'create' or 'delete' nomination)
                    // TODO: do something depending on whether this is a 'create' or 'delete' nomination?
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
                var pathNameWithDash = diffObj.path.split('/').join('-'); // replace all / in path with -
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