import ApplicationSerializer from './application'

export default ApplicationSerializer.extend({
  attrs: {
    name : {embedded: 'always'}
  }

});
