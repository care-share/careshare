/* globals jQuery */

import Ember from 'ember';
import config from './config/environment';

export default {
    host: config.APP.apiUrl,
    openidlogin: function (data) {
        console.log('openidlogin sent with code: ' + data);
        var that = this;
        var deferred = jQuery.ajax(this.host + '/auth/openid?code=' + data, null)
            .then(function (data) {
                    console.log('data: ' + JSON.stringify(data));
                    console.log('token: ' + data.data.token);
                    return that.createSessionData(data);
                },
                function (error) {
                    return {status: error.statusText, message: error.responseText};
                });
        return Ember.RSVP.resolve(deferred);
    },
    login: function (username, password) {
        var payload = {
            email: username,
            password: password
        };
        var that = this;
        var deferred = jQuery.post(this.host + '/auth/login', payload)
            .then(function (data) {
                    console.log('data: ' + JSON.stringify(data));
                    console.log('token: ' + data.data.token);
                    return that.createSessionData(data);
                },
                function (error) {
                    return {status: error.statusText, message: error.responseText};
                });
        return Ember.RSVP.resolve(deferred);
    },
    createSessionData: function (data) {
        return {
            token: data.data.token,
            name_first: data.data.name_first,
            roles: data.data.roles,
            _id: data.data._id,
            email: data.data.email,
            isAdmin: data.data.roles.indexOf('admin') > -1
        };
    },
    submitRequest: function (info, controller) {
        console.log('Account request sent: Full Name - ' + info.fullName + ',Email - ' + info.email);
        Ember.$.ajax({
            type: 'POST',
            url: this.host + '/auth/register',
            data: {name_first: info.first, name_last: info.last, email: info.email, password: info.pass},
            success: function () {
                console.log('Account request submission succeeded.');
                controller.set('accountRequestFailed', false);
                controller.set('accountRequestSucceeded', true);
            },
            error: function () {
                console.log('Account request submission failed.');
                controller.set('accountRequestSucceeded', false);
                controller.set('accountRequestFailed', true);
            }
        });
    },
    roles: function (input, controller) {
        console.log('ask for all roles w/ token: ' + input.token);
        //var email = input.email;
        jQuery.ajax(this.host + '/users/roles', {headers: {'X-Auth-Token': input.token}})
            .then(
                function (response) {
                    console.log('ROLES: ' + JSON.stringify(response.data));
                    controller.set('allRoles', response.data);
                    return response.data;
                }, function (error) {
                    return {status: error.statusText, message: error.responseText};
                });
    },
    approved: function (input, controller) {
        console.log('ask for all approved users w/ token: ' + input.token);
        //var email = input.email;
        jQuery.ajax(this.host + '/users/approved', {headers: {'X-Auth-Token': input.token}})
            .then(function (response) {
                console.log('APPROVED: ' + JSON.stringify(response.data));
                controller.set('approved', response.data);
                return response.data;
            }, function (error) {
                return {status: error.statusText, message: error.responseText};
            });
    },
    unapproved: function (input, controller) {
        console.log('ask for unapproved w/ token: ' + input.token);
        jQuery.ajax(this.host + '/users/unapproved', {headers: {'X-Auth-Token': input.token}})
            .then(function (response) {
                console.log('UNAPPROVED: ' + JSON.stringify(response.data));
                controller.set('model', response.data);
                return response.data;
            }, function (error) {
                return {status: error.statusText, message: error.responseText};
            });
    },
    logout: function (data) {
        jQuery.post(this.host + '/auth/logout', {headers: {'X-Auth-Token': data.token}})
            .then(function () {
            });
        return Ember.RSVP.resolve({token: null});
    },
    approve: function (id, data, controller) {
        console.log('APPROVE: ' + id);
        Ember.$.ajax({
            url: this.host + '/users/' + id + '/approve',
            type: 'post',
            headers: {
                'X-Auth-Token': data.token
            },
            dataType: 'json',
            success: function (data) {
                console.info(data);
                controller.send('reset');
            }
        });

        return false;
    },
    deny: function (id, data, controller) {
        console.log('DENY: ' + id);
        Ember.$.ajax({
            url: this.host + '/users/' + id,
            type: 'delete',
            headers: {
                'X-Auth-Token': data.token
            },
            dataType: 'json',
            success: function (data) {
                console.info(data);
                controller.send('reset');
            }
        });

        return false;
    },
    addRole: function (id, role, data, controller) {
        console.log('ADD ROLE: ' + role + ' FOR USER ' + id);
        return changeRole(this.host, id, role, data, controller, true);
    },
    removeRole: function (id, role, data, controller) {
        console.log('REMOVE ROLE: ' + role + ' FOR USER ' + id);
        return changeRole(this.host, id, role, data, controller, false);
    },
    changeFhirId: function (id, fhir_id, data, controller) {
        console.log('SET FHIR ID: ' + fhir_id + ' FOR USER ' + id);
        var url = `${this.host}/users/${id}/fhir_id`;
        if (fhir_id) {
            url += `/${fhir_id}`;
        }
        Ember.$.ajax({
            url: url,
            type: (fhir_id ? 'put' : 'delete'),
            headers: {
                'X-Auth-Token': data.token
            },
            dataType: 'json',
            success: function (data) {
                console.info(data);
                controller.send('reset');
            }
            // TODO: handle error case
        });
    }
};

function changeRole(host, id, role, data, controller, toggle) {
    var action = toggle ? 'put' : 'delete';
    Ember.$.ajax({
        url: host + '/users/' + id + '/roles/' + role,
        type: action,
        headers: {
            'X-Auth-Token': data.token
        },
        dataType: 'json',
        success: function (data) {
            console.info(data);
            controller.send('reset');
        }
    });

    return false;
}
