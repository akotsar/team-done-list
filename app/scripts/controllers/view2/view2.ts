/// <reference path="../../_app.ts" />

module MyApp.View2 {
    export class View2Ctrl {
        public static $inject = [
            '$scope'
        ];
        constructor(private $scope: ng.IScope) {
        }
    }

    angular.module('myApp.view2', [])
        .controller("View2Ctrl", View2Ctrl);
}