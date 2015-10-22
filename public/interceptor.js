angular.module('authorization-interceptor', [])
.config(function ($provide, $httpProvider) {
    
    $provide.factory('AuthorizationInterceptor', function ($q) {
        return {
            // On request success
            request: function (config) {
                if (window.sessionStorage && window.sessionStorage.getItem('token')) {
                    var token = JSON.parse(window.sessionStorage.getItem('token'));
                    config.headers.Authorization= 'Bearer ' + token;
                }
                return config || $q.when(config);
            }
        };
    });
    
    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('AuthorizationInterceptor');

});