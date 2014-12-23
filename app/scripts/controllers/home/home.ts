/// <reference path="../../_app.ts" />

module WhoDidWhat.Home {
    /**
     * Defines the scope interface of the home controller.
     */
    export interface IHomeCtrlScope extends ng.IScope {
        /**
         * The greeting message.
         */
        greeting?: string;
    }

    /**
     * The home page controller.
     */
    export class HomeCtrl {
        public static $inject = [
            '$scope',
            '$http'
        ];
        constructor(private $scope: IHomeCtrlScope, private $http: ng.IHttpService) {
            $http.get<any>('/api/account').success((resp) => {
                $scope.greeting = resp.greeting;
            });
        }
    }

    angular.module('whoDidWhat.home', [])
        .controller('HomeCtrl', HomeCtrl);
}