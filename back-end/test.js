var http = require('http');
var assert = require('assert');
var should = require('should');
var expect = require('chai').expect;
var request = require('supertest');
var server = require('./bin/www');

const loginDetails = {
    username: 'username',
    password: '123123'
};

var authenticatedUser = request.agent(server);

describe('Server test', function() {

    describe('Log in', function () {
        it('Log in the user successfully', function (done) {

            authenticatedUser
                .post('/login')
                .send(loginDetails)
                .end(function (err, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
        });
    });

});