describe('loginController', function () {
    beforeEach(module('login-ui'));
    
    var $controller;
    var $rootScope;
    
    var token = { data : "eyJhbGciOiJIUzI1NiJ9.amFjb2I.-cLRhkTc_5_sjx9S41P2JIqfDx1_bR0iDjJ4BM8xwvI" };

    var mockSuccessPost = function (postData) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve(token), 500);
        });
    };
    
    var mockFailPost = function (postData) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve(null), 500);
        });
    }
    
    beforeEach(inject(function (_$controller_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $rootScope = _$rootScope_.$new();        
        $controller = _$controller_;
    }));
    
    var setupController = function (mockPostFunction) {
        var $httpMock = { post : mockPostFunction };
        var $locationMock = { url : function (urlAddress) { } };
        var controller = $controller('loginController', { $scope: $rootScope, $http: $httpMock, $location : $locationMock });
        controller.user.username = "jacob";
        controller.user.password = "test";
        
        return controller;
    }
    
    describe('login()', function () {
        it('should set sessionStorage user if successful login', function (done) {
            var controller = setupController(mockSuccessPost);
            controller.login().then(function () {
                var token = JSON.parse(window.sessionStorage.getItem("token"));
                var username = atob(token.split(".")[1]);
                expect(username).toEqual(controller.user.username);
                done();
            }, function (error) { 
            });
        });

        it('should not get sessionStorage user if login fails', function (done) {
            var controller = setupController(mockFailPost);
            controller.login().then(function () {
                var token = JSON.parse(window.sessionStorage.getItem("token"));
                expect(token).toEqual(null);
                done();
            }, function (error) {
            });
        });
    });

    describe('logout()', function () {
        it('clears any user in storage', function (done) {
            var controller = setupController(mockSuccessPost);
            controller.login().then(function () {
                controller.logout();
                var token = JSON.parse(window.sessionStorage.getItem("token"));
                expect(token).toEqual(null);
                done();
            });
        });
    });
});

