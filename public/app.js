// create the module and name it hostApp
var hostApp = angular.module('hostApp', ['ngRoute', 'library-ui']);

hostApp.config(function($routeProvider) {
    $routeProvider

	// route for the home page
	.when('/', {
		    templateUrl : 'app/home/home.html',
		    controller: 'mainController'
	    })

	    // route for the about page
	    .when('/about', {
		    templateUrl : 'app/about/about.html',
		    controller : 'aboutController'
	    })
	
});

hostApp.controller('mainController', ['$scope', function ($scope) {
    $scope.message = 'Welcome to the library, books can be added and removed.';
}]);

hostApp.controller('aboutController', function($scope) {
    $scope.message = 'This is the about page.';
});

