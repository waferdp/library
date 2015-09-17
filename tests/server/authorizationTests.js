
var app = {};
var assert = require("assert");
var mongoose = require('mongoose');
var passPortConnection = mongoose.createConnection("mongodb://192.168.1.18/passport");
var User = require('../../models/User').UserModel(passPortConnection);

var auth = require("../../authorization.js")(app, User);



describe('Authorization', function () {
    describe('login(username, password)', function () {
        it('should reject with error when user/password is not found', function (done) {
            
            var userPromise = app.login('jacob', 'badPassword');
            userPromise.then(function (user) {
                assert.equal(user,null)
                fail();
            }, function (error) {
                done();
            });
        });

        it('should return user when user/password is matches', function (done) {
            
            var userPromise = app.login('jacob', 'test');
            userPromise.then(function (user) {
                //console.log("before assert" + JSON.stringify(user));
                assert.notEqual(user, null);
                done();
            });
        });

    });

    describe('tokenValidationPromise(token)', function () {
        it('should reject with error if token is not found', function (done) {
            var token = "123456";
            var validatePromise = app.tokenValidationPromise(token);
            validatePromise.then(function (user) { 
                assert.equal(user, null, "This should not even happen");
            }, function (error) { 
                done();
            });
        });
        it('should return user if token is found', function (done) {
            var token = "JDJhJDEwJGh2NGpUanRWMjZhS0dzVzBKQzBoR2UxL1BkZHAuWnhCRVFxU0pnMDRsN3BOVjFja2czdVgy";
            var validatePromise = app.tokenValidationPromise(token);
            validatePromise.then(function (user) {
                assert.equal(user.token, token);
                done();
            });
        });
    });
});