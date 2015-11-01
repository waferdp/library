// create the module and name it hostApp
var hostApp = angular.module('hostApp', ['ngRoute', 'library-ui', 'login-ui','authorization-interceptor']);

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
                
        checkLoggedin($q, $http, $location);
}]);

hostApp.controller('aboutController', function($scope) {
    $scope.message = 'This is the about page.';
});

hostApp.controller('authController', ['$scope', function ($scope) {
    $scope.message = 'Log in to api';
}]);

var checkLoggedin = function($q, $http, $location){ 
    // Initialize a new promise 
    var deferred = $q.defer(); 
    // Make an AJAX call to check if the user is logged in 
    var token = null;
    if (window.sessionStorage && window.sessionStorage.getItem("token")) {
        token = JSON.parse(window.sessionStorage.getItem("token"));
    }
    
    if (token) {
        $http.get('/loggedin/' + token).success(function (token) {
            // Authenticated 
            if (token) {
                deferred.resolve('Welcome to the library, books can be added and removed.');
            }
            // Not Authenticated 
            else {
                $location.url('/auth');                
                deferred.reject('Token no longer valid.');
            }
        }, function (error) {
            $location.url('/auth')
            deferred.reject('Error when logging in.');
        }
        );
    } else {
        $location.url('/auth')
        deferred.reject('You need to log in.');
    }

    return deferred.promise; 
};
