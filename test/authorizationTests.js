
var app = {};
var assert = require("assert");
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var passPortConnection = mongoose.createConnection("mongodb://192.168.1.18/passport");

var User = require('../models/User.js').UserModel(passPortConnection);
var auth = require("../authorization.js")(User); //(app, User);

describe('authorization.js', function () {

    beforeEach(function (done) {
        mockgoose.reset();
        User.create({
            _id: mongoose.Types.ObjectId(),
            email : "",
            token : "JDJhJDEwJGh2NGpUanRWMjZhS0dzVzBKQzBoR2UxL1BkZHAuWnhCRVFxU0pnMDRsN3BOVjFja2czdVgy",
            password : "$2a$10$z8xc5abhc.eZXvJ1owS2heO2/XWr9qkWnEBeeTuITNJO9t/Z8v8uO",
            username : "jacob"
        }, function (err, model) {
            done(err);
        });
    });
    
    afterEach(function (done) {
        //Reset the database after every test.
        mockgoose.reset();
        done();
    });    
    
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
    
    describe('signup(username, password, email)', function () {
        it('should return an new user if succesful', function (done) {
            var signupPromise = auth.signup('testUser', 'testPassword', 'noreply@email.com')
            signupPromise.then(function (newUser) {
                var tokenPromise = auth.validateToken(newUser.token);
                tokenPromise.then(function (foundUser) {
                    assert.equal(newUser.id, foundUser.id);
                    done();
                }, function (error) {
                    console.error(error);
                    assert.equal(1, 0);
                });
            }, function (error) { 
                console.error(error);
                assert.equal(0, 1);
            });
        });

        it('should reject if username already exists', function (done) {
            var signupPromise = auth.signup('jacob', 'testPassword', 'jacob@email.com');
            signupPromise.then(function (newUser) { 
                assert.fail(newUser, "User exists, signup should reject");
            }, function (error) { 
                done();
            });
        });
    });
    

    describe('validateToken(token)', function () {
        it('should reject with error if token is not found', function (done) {
            var token = "123456";
            var validatePromise = auth.validateToken(token);
            validatePromise.then(function (user) { 
                assert.equal(user, null, "This should not even happen");
            }, function (error) { 
                done();
            });
        });
        it('should return user if token is found', function (done) {
            var token = "JDJhJDEwJGh2NGpUanRWMjZhS0dzVzBKQzBoR2UxL1BkZHAuWnhCRVFxU0pnMDRsN3BOVjFja2czdVgy";
            var validatePromise = auth.validateToken(token);
            validatePromise.then(function (user) {
                assert.equal(user.token, token);
                done();
            });
        });
    });
});