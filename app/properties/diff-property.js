// used to add a 'diff' attribute to a model

export default function (attribute) {
    return function(key, value /*, previousValue*/) {
        // key == <attribute>Diff
        // setter
        var diffVal;
        if (arguments.length > 1) {
            diffVal = value;
            this.set(`${key}Val`, value); // <attribute>DiffVal
        } else {
            diffVal = this.get(`${key}Val`); // <attribute>DiffVal
        }

        // getter
        if (diffVal !== null && diffVal !== undefined) {
            return diffVal; // <attribute>DiffVal
        }
        return this.get(`${key.slice(0, -4)}`); // <attribute>
    }.property(attribute, `${attribute}DiffVal`);
}