/// <reference path="../../_app.ts" />

module TeamDoneList.View2 {
    export class View2Ctrl {
        public static $inject = [
            '$scope'
        ];
        constructor(private $scope: ng.IScope) {
        }
    }

    angular.module('teamDoneList.view2', [])
        .controller("View2Ctrl", View2Ctrl);
}