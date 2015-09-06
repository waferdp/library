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

hostApp.controller('mainController', ['$scope', function ($scope) {
    $scope.message = 'Welcome to the library, books can be added and removed.';
}]);

hostApp.controller('aboutController', function($scope) {
    $scope.message = 'This is the about page.';
});

hostApp.controller('authController', ['$scope', function ($scope) {
    $scope.message = 'Log in to api';
}]);

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){ 
    // Initialize a new promise 
    var deferred = $q.defer(); 
    // Make an AJAX call to check if the user is logged in 
    $http.get('/loggedin').success(function(user) { 
        // Authenticated 
        if (user !== '0') {
            deferred.resolve();
            console.log("Logged in as " + user.username)
        }
            // Not Authenticated 
        else {
            $scope.message = 'You need to log in.';
            deferred.reject();
            $location.url('/auth');
        }
    }); 
    return deferred.promise; 
};
