var loginApp = angular.module('login-ui', []);

loginApp.controller('loginController', ['$http', '$scope', '$location', '$q', function ($http, $scope, $location, $q) {
    this.user = {};
    var self = this;        
        
    this.loggedIn = function () {
        return getStoredToken();           
    };
        
    this.submitOnEnter = function ($event, isFormValid) {
        if (isFormValid && $event.keyCode == 13) {
            self.login();
        }
    }

    this.loggedInUser = function () {
        var token = getStoredToken();
        if (token && token.split(".").length == 3) {
            var payloadEncoded = token.split(".")[1];
            var payload = atob(payloadEncoded);
            return payload;
        }
        return "";
    }    
        
    var getStoredToken = function () {
        if (window.sessionStorage) {
            return window.sessionStorage.getItem('token');
        }
        return null;
    }    

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

    $scope.$on('$routeChangeSuccess', function (event) {
        if (loginForm && loginForm.user) {
            loginForm.username.focus();
        }
    });

}]);