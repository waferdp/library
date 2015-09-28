
var app = {};
var assert = require("assert");
var mongoose = require('mongoose');
//var mockgoose = require('mockgoose');
var passPortConnection = mongoose.createConnection("mongodb://192.168.1.18/passport");
//svar User = ;

var User = require('../../models/User').UserModel(passPortConnection);
var auth = require("../../authorization.js")(User); //(app, User);



describe('Authorization', function () {
    describe('login(username, password)', function () {
        it('should reject with error when user/password is not found', function (done) {

            var userPromise = auth.login('jacob', 'badPassword');
            userPromise.then(function (user) {
                assert.equal(0, 1);
            }, function (error) {
                done();
            });
        });

        it('should return user when user/password is matches', function (done, fail) {
            
            var userPromise = auth.login('jacob', 'test');
            userPromise.then(function (user) {
                //console.log("before assert" + JSON.stringify(user));
                assert.notEqual(user, null);
                done();
            }, function (error) {
                console.error(error);
                assert.equal(0, 1);
            });
        });

    });

    describe('tokenValidationAsync(token)', function () {
        it('should reject with error if token is not found', function (done) {
            var token = "123456";
            var validatePromise = auth.tokenValidationAsync(token);
            validatePromise.then(function (user) { 
                assert.equal(user, null, "This should not even happen");
            }, function (error) { 
                done();
            });
        });
        it('should return user if token is found', function (done) {
            var token = "JDJhJDEwJGh2NGpUanRWMjZhS0dzVzBKQzBoR2UxL1BkZHAuWnhCRVFxU0pnMDRsN3BOVjFja2czdVgy";
            var validatePromise = auth.tokenValidationAsync(token);
            validatePromise.then(function (user) {
                assert.equal(user.token, token);
                done();
            });
        });
    });
});