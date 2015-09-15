describe('loginController', function () {
    beforeEach(module('login-ui'));
    
    var $controller;
    var $rootScope;
    
    var mockPost = function (postData) { 
        return new Promise(function (resolve, reject) {
            var userObject = {
                    username : 'jacob',
                    password : 'unintelligible',
                    token: '123456789ABCDEFGHIJKLMNOPQRTUVWXYZ',
                    email: 'jacob.brannstrom@email.com'
            };
            setTimeout(resolve(userObject), 500);
        });
    }; 
    
    beforeEach(inject(function (_$controller_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $rootScope = _$rootScope_.$new();        
        $controller = _$controller_;
    }));
    
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('login', function () {
        it('logs in to library API', function () {
            var $httpMock = { post : mockPost };
            var controller = $controller('loginController', { $scope: $rootScope, $http: $httpMock, $location : {} });
            controller.user.username = "jacob";
            controller.user.password = "test";
            controller.login();
            console.log(window.sessionStorage.getItem('user'));
            var user = JSON.parse(window.sessionStorage.getItem('user'));
            expect(user.username).toEqual('jacob');
            
        });
    });
});