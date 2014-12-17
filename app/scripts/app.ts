/// <reference path="_app.ts" />

module App {
    // Declare app level module which depends on views, and components
    angular.module('myApp', [
        'ngRoute',
        'myApp.view1',
        'myApp.view2',
        'myApp.version'
    ])
        .config(['$routeProvider', ($routeProvider: ng.route.IRouteProvider) => {
            $routeProvider.otherwise({ redirectTo: '/view1' });
        }]);
}