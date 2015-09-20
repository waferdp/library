describe('loginController', function () {
    beforeEach(module('login-ui'));
    
    var $controller;
    var $rootScope;
    
    var testUserObject = {
        data : {
            username : 'jacob',
            password : 'unintelligible',
            token: '123456789ABCDEFGHIJKLMNOPQRTUVWXYZ',
            email: 'jacob.brannstrom@email.com'
        }
    };

    var mockPost = function (postData) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve(testUserObject), 500);
        });
    }; 
    
    beforeEach(inject(function (_$controller_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $rootScope = _$rootScope_.$new();        
        $controller = _$controller_;
    }));
    
    describe('login', function () {
        it('logs in to library API', function (done) {
            var $httpMock = { post : mockPost };
            var $locationMock = { url : function (urlAddress) { } };
            var controller = $controller('loginController', { $scope: $rootScope, $http: $httpMock, $location : $locationMock });
            console.log("In test");
            controller.user.username = "jacob";
            controller.user.password = "test";
            controller.login().then(function () {
                var user = JSON.parse(window.sessionStorage.getItem("user"));
                expect(user.username).toEqual(controller.user.username);
                done();
            }, function (error) { 
                console.error("In error: " + error);
            });
            
        });
    });
});