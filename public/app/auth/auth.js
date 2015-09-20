var loginApp = angular.module('login-ui', []);

loginApp.controller('loginController', ['$http', '$scope', '$location', function ($http, $scope, $location) {
    this.user = {};

    this.login = function () {
        var postPromise = $http.post('login', JSON.stringify(this.user)).then(function (user) {
            $scope.message = "Logged in as " + user.username;
            storeUser(user.data);
                $location.url('/');
        });
        return postPromise;
    };

    this.signup = function () {
        $http.post('signup', JSON.stringify(this.user)).then(function(newUser) {
            storeUser(newUser)
            $scope.message = newUser.message;
        });
    }

    function storeUser(user) {
        console.log('Storing user');
        if (window.sessionStorage) {
            window.sessionStorage.setItem('user', JSON.stringify(user));
        }
    }
    
}]);