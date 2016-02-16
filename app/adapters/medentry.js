import base from 'careshare/adapters/careauth/base';

export default base.extend({
    pathForType: function (/*type*/) {
        // this adapter only supports the 'update' method
        return 'medentries';
    },
    urlForQuery(query, modelName) {
        // instead of doing urls like '/url?patient_id=foo', we want to do it like '/url/patient_id/foo'
        var url = this._super(query, modelName);
        if (query.patient_id) {
            url += '/patient_id/' + query.patient_id;
            // delete the patient_id attribute from the query object
            // (otherwise the URL will have '?patient_id=foo' tacked onto the end of it)
            delete query.patient_id;
        }
        return url;
    }
});
