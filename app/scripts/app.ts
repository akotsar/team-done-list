/// <reference path="_app.ts" />
/// <reference path="controllers/account/account.ts"/>
/// <reference path="controllers/signin/signin.ts"/>

module WhoDidWhat {
    // Declare app level module which depends on views, and components
    angular.module('whoDidWhat', [
            'ngAnimate',
            'ui.router',
            'ngMaterial',
            'whoDidWhat.account',
            'whoDidWhat.version',
            'whoDidWhat.signin',
            'whoDidWhat.auth'
        ])
        .config([
            '$httpProvider', '$urlRouterProvider', '$stateProvider', (
                $httpProvider: ng.IHttpProvider,
                $urlRouterProvider: ng.ui.IUrlRouterProvider,
                $stateProvider: ng.ui.IStateProvider
            ) => {
                // For any unmatched url, redirect to /account
                $urlRouterProvider.otherwise('/account');

                // Configure states.
                $stateProvider
                    .state('signin', {
                        url: '/signin',
                        templateUrl: 'views/signin.html',
                        controller: SignIn.SignInCtrl,
                        data: {
                            allow_anonymous: true
                        }
                    })
                    .state('account', {
                        url: '/account',
                        templateUrl: 'views/account/account.html',
                        controller: Account.AccountCtrl
                    });
            }
        ])
        .run(['$rootScope', '$state',
            ($rootScope: ng.IScope, $state: ng.ui.IStateService) => {
                // Handling all access-denied messages and redirecting the user to
                // the signin page.
                $rootScope.$on(Auth.AuthService.Events.AccessDenied, () => {
                    $state.go('signin');
                });

                // Handling signing out by navigating to the sigin page.
                $rootScope.$on(Auth.AuthService.Events.SignedOut, () => {
                    $state.go('signin');
                });
            }
        ]);
}