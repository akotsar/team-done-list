/// <reference path="_app.ts" />
/// <reference path="controllers/home/home.ts"/>
/// <reference path="controllers/signin/signin.ts"/>

module WhoDidWhat {
    /**
     * Defines the scope interface for the application-level controller.
     */
    export interface IAppCtrlScope extends ng.IScope {
        /**
         * Signs the current user out.
         */
        signOut(): void;
    }

    /**
     * The top-level controller for the application.
     */
    export class AppCtrl {
        public static $inject = [
            '$scope',
            '$state',
            'authService'
        ];

        constructor($scope: IAppCtrlScope, $state: ng.ui.IStateService, authService: Auth.AuthService) {
            $scope.signOut = () => {
                authService.signOut();
            };
        }
    }

    // Declare app level module which depends on views, and components
    angular.module('whoDidWhat', [
            'ui.router',
            'whoDidWhat.home',
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
                // For any unmatched url, redirect to /home
                $urlRouterProvider.otherwise('/home');

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
                    .state('home', {
                        url: '/home',
                        templateUrl: 'views/home.html',
                        controller: Home.HomeCtrl
                    });
            }
        ])
        .controller('AppCtrl', AppCtrl)
        .run(['$rootScope', '$state',
            ($rootScope: ng.IScope, $state: ng.ui.IStateService) => {
                // Handling all access-denied messages and redirecting the user to
                // the signin page.
                $rootScope.$on('auth:access-denied', () => {
                    $state.go('signin');
                });

                // Handling signing out by navigating to the sigin page.
                $rootScope.$on('auth:signed-out', () => {
                    $state.go('signin');
                });
            }
        ]);
}