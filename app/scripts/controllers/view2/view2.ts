/// <reference path="../../_app.ts" />

module MyApp.View2 {
    export class View2Ctrl {
        public static $inject = [
            '$scope'
        ];
        constructor(private $scope: ng.IScope) {
        }
    }

    angular.module('myApp.view2', ['ngRoute'])
        .config([
            '$routeProvider', ($routeProvider: ng.route.IRouteProvider) => {
                $routeProvider.when('/view2', {
                    templateUrl: 'views/view2.html',
                    controller: View2Ctrl
                });
            }
        ]);
}