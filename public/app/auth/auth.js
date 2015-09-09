var loginApp = angular.module('login-ui', []);

loginApp.controller('loginController', ['$http', '$scope', '$location', function ($http, $scope, $location) {
    this.user = {};

    this.login = function () {
        $http.post('login', JSON.stringify(this.user)).success(function (user) {
            $scope.message = "Logged in as " + user.username;
            storeUser(user);
            $location.url('/')
        });
    };

    this.signup = function () {
        $http.post('signup', JSON.stringify(this.user)).success(function(newUser) {
            storeUser(newUser)
            $scope.message = newUser.message;
        });
    }

        function storeUser(user) {
            if (window.sessionStorage) {
                window.sessionStorage.setItem('user', JSON.stringify(user));
            }
        }
    
}]);