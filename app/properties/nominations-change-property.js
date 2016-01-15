// used to add a 'diff' attribute to a model

export default function () {
    return function() {
        // Sets changes to this when nominations changes
        var changeDic = {};
        var noms = this.get('nominations');
        for (var n in noms){
            if (noms.hasOwnProperty(n)){
                for (var d in noms[n].diff){
                    if (noms[n].diff.hasOwnProperty(d)){
                        var diffObj = noms[n].diff[d];
                        console.log(diffObj);
                        var crObj = {
                            'originalValue': diffObj.originalValue,
                            'value': diffObj.value
                        };
                        var pathNameWithDash = diffObj.path.replace('/','-');
                        if (changeDic[pathNameWithDash]){
                            changeDic[pathNameWithDash].push(crObj);
                        }
                        else {
                            changeDic[pathNameWithDash] = [crObj];
                        }
                    }
                }
            }

        }

        return changeDic;
    }.property('nominations');
}