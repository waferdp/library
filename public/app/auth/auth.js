var loginApp = angular.module('login-ui', []);

loginApp.controller('loginController', ['$http', '$scope', function ($http, $scope) {
    this.user = {};

    this.login = function () {
        $http.post('login', JSON.stringify(this.user)).success(function (data) {
            $scope.message = "Logged in as " + data.username;
            if (window.sessionStorage) {
                window.sessionStorage.setItem('user', JSON.stringify(data));
            }
        });
    };

    this.signup = function () {
        $http.post('signup', JSON.stringify(this.user)).success(function(data) {
            $scope.message = data.message;
        });
    }

    
}]);