import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
    authorize(sessionData, block){
        console.log(`Authorizing request with token: ${sessionData.token}`);
        block('X-Auth-Token', sessionData.token);
    }
});
