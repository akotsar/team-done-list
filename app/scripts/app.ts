/// <reference path="_app.ts" />
/// <reference path="typings/angular-ui/angular-ui-router.d.ts"/>

module TeamDoneList {
    // Declare app level module which depends on views, and components
    angular.module('teamDoneList', [
        'ui.router',
        'teamDoneList.view1',
        'teamDoneList.view2',
        'teamDoneList.version'
    ])
    .config(['$urlRouterProvider', '$stateProvider', (
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $stateProvider: ng.ui.IStateProvider
        ) => {
        // For any unmatched url, redirect to /view1
        $urlRouterProvider.otherwise("/view1");

        // Configure states.
        $stateProvider
            .state('view1', {
                url: "/view1",
                templateUrl: "views/view1.html",
                controller: View1.View1Ctrl
            })
            .state('view2', {
                url: "/view2",
                templateUrl: "views/view2.html",
                controller: View2.View2Ctrl
            });
    }]);
}