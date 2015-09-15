
var assert = require("assert");
var auth = require("../../authorization");

var app = {};
auth(app);

describe('Authorization', function () {
    describe('login()', function () {
        it('should return null when user/password is not found', function () {
            
            assert.null(app.login('jacob', 'test2'));
        });
    });
});