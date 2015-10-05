var loginApp = angular.module('login-ui', []);

loginApp.controller('loginController', ['$http', '$scope', '$location', function ($http, $scope, $location) {
    this.user = {};
        
        
    this.loggedIn = function () {
        if (window.sessionStorage) {
            return window.sessionStorage.getItem('token');
        }
        return false;
    };

    this.login = function () {
        var postPromise = $http.post('login', JSON.stringify(this.user)).then(function (token) {
            if (token) {
                $scope.message = "";
                storeToken(token.data);
                $location.url('/');
            }
            else {
                clearToken();
            }
        });
        return postPromise;
    };
        
    this.logout = function () {
            clearToken();
    };

    this.signup = function () {
        $http.post('signup', JSON.stringify(this.user)).then(function (token) {
            storeToken(token.data)
            $scope.message = "";
        });
    };

    function storeToken(user) { 
        if (window.sessionStorage) {
            window.sessionStorage.setItem('token', JSON.stringify(user));
        }
    }

    function clearToken() {
        if (window.sessionStorage) {
            var storedToken = window.sessionStorage.getItem('token');
            if (storedToken) {
                window.sessionStorage.removeItem('token');
            }
        }
    }
}]);