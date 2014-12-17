/// <reference path="../../_app.ts" />

module MyApp.View1 {
    // Extending the default scope with items needed by the controller.
    export interface IView1CtrlScope extends ng.IScope {
        greeting?: string;
    }

    export class View1Ctrl {
        public static $inject = [
            '$scope'
        ];
        constructor(private $scope: IView1CtrlScope) {
            $scope.greeting = "Hello from View1Ctrl constructor.";
        }
    }

    angular.module('myApp.view1', ['ngRoute'])
        .config([
            '$routeProvider', ($routeProvider: ng.route.IRouteProvider) => {
                $routeProvider.when('/view1', {
                    templateUrl: 'views/view1.html',
                    controller: View1Ctrl
                });
            }
        ]);
}