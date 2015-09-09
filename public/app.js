// create the module and name it hostApp
var hostApp = angular.module('hostApp', ['ngRoute', 'library-ui', 'login-ui']);

hostApp.config(function($routeProvider) {
    $routeProvider

	// route for the home page
	.when('/', {
		    templateUrl : 'app/home/home.html',
		    controller: 'mainController',
	    })

	    // route for the about page
	.when('/about', {
		templateUrl : 'app/about/about.html',
		controller : 'aboutController'
	})

    .when('/auth', {
        templateUrl: 'app/auth/auth.html',
        controller : 'authController'
    })
	
});

hostApp.controller('mainController', ['$scope','$q', '$http', '$location', function ($scope, $q, $http, $location) {
        
    checkLoggedin($q, $http, $location, $scope);
}]);

hostApp.controller('aboutController', function($scope) {
    $scope.message = 'This is the about page.';
});

hostApp.controller('authController', ['$scope', function ($scope) {
    $scope.message = 'Log in to api';
}]);

var checkLoggedin = function($q, $http, $location, $rootScope){ 
    // Initialize a new promise 
    var deferred = $q.defer(); 
    // Make an AJAX call to check if the user is logged in 
    var user = null;
    if (window.sessionStorage && window.sessionStorage.getItem("user")) {
        user = JSON.parse(window.sessionStorage.getItem("user"));
    }
    
    if (user) {
        $http.get('/loggedin/' + user.token).success(function (user) {
            // Authenticated 
            if (user !== '0') {
                $rootScope.message = 'Welcome to the library, books can be added and removed.';
                deferred.resolve();
                console.log("Logged in as " + user.username)
            }
            // Not Authenticated 
            else {
                $rootScope.message = 'Token no longer valid.';
                deferred.reject();
                $location.url('/auth');
            }
        }, function (error) {
            $rootScope.message = 'Error when logging in.';
            deferred.reject();
            $location.url('/auth')
        }
        );
    } else {
        $rootScope.message = 'You need to log in.';
        deferred.reject();
        $location.url('/auth')

        deferred.reject();
    }

    return deferred.promise; 
};
