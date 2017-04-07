'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute'
]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
        .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    })
        .otherwise({
        redirectTo: '/'
    }); 

}]);