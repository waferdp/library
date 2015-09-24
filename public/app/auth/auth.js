var loginApp = angular.module('login-ui', []);

loginApp.controller('loginController', ['$http', '$scope', '$location', function ($http, $scope, $location) {
    this.user = {};
        
        
    this.loggedIn = function () {
        if (window.sessionStorage) {
            return window.sessionStorage.getItem('user');
        }
        return false;
    };

    this.login = function () {
        var postPromise = $http.post('login', JSON.stringify(this.user)).then(function (user) {
            if (user) {
                $scope.message = "Logged in as " + user.username;
                storeUser(user.data);
                $location.url('/');
            }
                else {
                clearUser();
            }
        });
        return postPromise;
    };
        
    this.logout = function () {
        clearUser();
    };

    this.signup = function () {
        $http.post('signup', JSON.stringify(this.user)).then(function (newUser) {
            storeUser(newUser)
            $scope.message = newUser.message;
        });
    };

    function storeUser(user) {
        this.loggedIn = true;                
        if (window.sessionStorage) {
            window.sessionStorage.setItem('user', JSON.stringify(user));
        }
    }

    function clearUser() {
        this.loggedIn = false;
        if (window.sessionStorage) {
            var storedUser = window.sessionStorage.getItem('user');
            if (storedUser) {
                window.sessionStorage.removeItem('user');
            }
        }
    }
}]);